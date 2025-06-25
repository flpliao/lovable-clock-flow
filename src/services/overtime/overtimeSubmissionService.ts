
import { supabase } from '@/integrations/supabase/client';
import { OvertimeRequest } from './types';

export const overtimeSubmissionService = {
  async submitOvertimeRequest(overtimeData: OvertimeRequest, currentUserId: string) {
    console.log('🚀 提交加班申請:', overtimeData);
    console.log('🔍 當前用戶ID:', currentUserId);
    
    try {
      // 首先驗證員工資料是否存在 - 更詳細的查詢
      console.log('🔍 驗證員工資料存在性，用戶ID:', currentUserId);
      
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, department, position, supervisor_id, email, role')
        .eq('id', currentUserId)
        .maybeSingle();

      console.log('📊 Staff查詢結果:', { staffData, staffError });

      if (staffError) {
        console.error('❌ 員工資料查詢錯誤:', staffError);
        throw new Error(`員工資料查詢失敗: ${staffError.message}`);
      }

      if (!staffData) {
        console.error('❌ 找不到員工資料，用戶ID:', currentUserId);
        
        // 額外檢查：列出所有員工ID來調試
        const { data: allStaff, error: allStaffError } = await supabase
          .from('staff')
          .select('id, name, email')
          .limit(10);
        
        console.log('📋 系統中的員工列表 (前10個):', allStaff);
        
        throw new Error('找不到對應的員工資料。請確認您的帳戶已正確設定。如果問題持續，請聯繫系統管理員檢查員工資料設定。');
      }

      console.log('✅ 員工資料驗證成功:', {
        id: staffData.id,
        name: staffData.name,
        department: staffData.department,
        position: staffData.position,
        role: staffData.role
      });

      // 確保只能為自己申請
      if (overtimeData.staff_id !== currentUserId) {
        console.error('❌ 員工ID不匹配:', { 
          overtimeStaffId: overtimeData.staff_id, 
          currentUserId 
        });
        throw new Error('只能為自己申請加班');
      }

      // 驗證必要欄位
      if (!overtimeData.overtime_date) {
        throw new Error('請選擇加班日期');
      }
      if (!overtimeData.start_time) {
        throw new Error('請選擇開始時間');
      }
      if (!overtimeData.end_time) {
        throw new Error('請選擇結束時間');
      }
      if (!overtimeData.overtime_type) {
        throw new Error('請選擇加班類型');
      }
      if (!overtimeData.compensation_type) {
        throw new Error('請選擇補償方式');
      }
      if (!overtimeData.reason || overtimeData.reason.trim() === '') {
        throw new Error('請填寫加班原因');
      }
      if (!overtimeData.hours || overtimeData.hours <= 0) {
        throw new Error('加班時數必須大於0');
      }

      // 檢查時間邏輯
      const startTime = new Date(overtimeData.start_time);
      const endTime = new Date(overtimeData.end_time);
      
      if (startTime >= endTime) {
        throw new Error('結束時間必須晚於開始時間');
      }

      console.log('✅ 所有驗證通過，準備提交到資料庫');
      
      // 準備插入的資料
      const insertData = {
        staff_id: overtimeData.staff_id,
        overtime_date: overtimeData.overtime_date,
        start_time: overtimeData.start_time,
        end_time: overtimeData.end_time,
        overtime_type: overtimeData.overtime_type,
        compensation_type: overtimeData.compensation_type,
        reason: overtimeData.reason.trim(),
        hours: overtimeData.hours,
        status: 'pending'
      };
      
      console.log('📝 準備插入的資料:', insertData);
      
      // 提交到資料庫，觸發器會自動設定審核流程
      const { data, error } = await supabase
        .from('overtimes')
        .insert(insertData)
        .select(`
          *,
          staff!staff_id (
            name,
            department,
            position,
            supervisor_id
          ),
          overtime_approval_records (
            id,
            approver_id,
            approver_name,
            level,
            status,
            approval_date,
            comment,
            created_at,
            updated_at
          )
        `)
        .single();

      if (error) {
        console.error('❌ 資料庫錯誤:', error);
        console.error('❌ 錯誤詳情:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // 處理常見的資料庫錯誤
        if (error.code === '23505') {
          throw new Error('重複的加班申請，請檢查是否已提交相同時間的申請');
        } else if (error.code === '23503') {
          throw new Error('員工資料參考錯誤。您的員工帳戶可能存在設定問題，請聯繫系統管理員檢查staff表格設定。');
        } else if (error.code === '42501') {
          throw new Error('權限不足，無法提交申請');
        } else if (error.message.includes('staff_id')) {
          throw new Error(`員工ID無效 (${currentUserId})，請重新登入後再試`);
        } else {
          throw new Error(`提交失敗: ${error.message || '資料庫操作錯誤'}`);
        }
      }

      console.log('✅ 加班申請提交成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 提交加班申請時發生錯誤:', error);
      
      // 確保錯誤信息被正確傳遞
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('提交加班申請時發生未知錯誤，請稍後再試');
      }
    }
  },

  async updateOvertimeRequest(overtimeId: string, updateData: Partial<OvertimeRequest>, currentUserId: string) {
    console.log('🔄 更新加班申請:', { overtimeId, updateData });
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .update({
          overtime_date: updateData.overtime_date,
          start_time: updateData.start_time,
          end_time: updateData.end_time,
          overtime_type: updateData.overtime_type,
          compensation_type: updateData.compensation_type,
          reason: updateData.reason,
          hours: updateData.hours,
          updated_at: new Date().toISOString()
        })
        .eq('id', overtimeId)
        .eq('staff_id', currentUserId) // 確保只能更新自己的申請
        .eq('status', 'pending') // 只能更新待審核的申請
        .select()
        .single();

      if (error) {
        console.error('❌ 更新加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 加班申請更新成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 更新加班申請時發生錯誤:', error);
      throw error;
    }
  },

  async cancelOvertimeRequest(overtimeId: string, currentUserId: string) {
    console.log('🗑️ 取消加班申請:', overtimeId);
    
    try {
      const { data, error } = await supabase
        .from('overtimes')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', overtimeId)
        .eq('staff_id', currentUserId) // 確保只能取消自己的申請
        .eq('status', 'pending') // 只能取消待審核的申請
        .select()
        .single();

      if (error) {
        console.error('❌ 取消加班申請失敗:', error);
        throw error;
      }

      console.log('✅ 加班申請取消成功:', data);
      return data;
    } catch (error) {
      console.error('❌ 取消加班申請時發生錯誤:', error);
      throw error;
    }
  }
};
