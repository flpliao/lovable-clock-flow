import { supabase } from '@/integrations/supabase/client';
import { OvertimeRequest } from './types';

export const overtimeSubmissionService = {
  async submitOvertimeRequest(overtimeData: OvertimeRequest, currentUserId: string) {
    console.log('🚀 提交加班申請:', overtimeData);
    
    try {
      // 確保只能為自己申請
      if (overtimeData.staff_id !== currentUserId) {
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

      console.log('✅ 驗證通過，準備提交到資料庫');
      
      const { data, error } = await supabase
        .from('overtimes')
        .insert({
          staff_id: overtimeData.staff_id,
          overtime_date: overtimeData.overtime_date,
          start_time: overtimeData.start_time,
          end_time: overtimeData.end_time,
          overtime_type: overtimeData.overtime_type,
          compensation_type: overtimeData.compensation_type,
          reason: overtimeData.reason.trim(),
          hours: overtimeData.hours,
          status: 'pending'
        })
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
        
        // 處理常見的資料庫錯誤
        if (error.code === '23505') {
          throw new Error('重複的加班申請，請檢查是否已提交相同時間的申請');
        } else if (error.code === '23503') {
          throw new Error('員工資料不存在或無效');
        } else if (error.code === '42501') {
          throw new Error('權限不足，無法提交申請');
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
