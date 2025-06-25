import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeService = {
  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    const { data, error } = await supabase
      .from('overtime_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      compensation_type: item.compensation_type as 'overtime_pay' | 'compensatory_time',
      description: item.description || undefined,
      special_rules: (typeof item.special_rules === 'object' && item.special_rules !== null) 
        ? item.special_rules as Record<string, any>
        : {} as Record<string, any>
    }));
  },

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    console.log('🔍 開始提交加班申請，原始表單資料:', formData);

    try {
      // 1️⃣ 驗證必填欄位
      if (!formData.overtime_type) {
        console.error('❌ 加班類型為空');
        throw new Error('請選擇加班類型');
      }
      if (!formData.overtime_date) {
        console.error('❌ 加班日期為空');
        throw new Error('請選擇加班日期');
      }
      if (!formData.start_time) {
        console.error('❌ 開始時間為空');
        throw new Error('請選擇開始時間');
      }
      if (!formData.end_time) {
        console.error('❌ 結束時間為空');
        throw new Error('請選擇結束時間');
      }
      if (!formData.reason || formData.reason.trim() === '') {
        console.error('❌ 加班原因為空');
        throw new Error('請填寫加班原因');
      }

      // 2️⃣ 驗證時間邏輯
      const startTime = new Date(`2000-01-01T${formData.start_time}`);
      const endTime = new Date(`2000-01-01T${formData.end_time}`);
      
      console.log('⏰ 時間驗證:', {
        start_time: formData.start_time,
        end_time: formData.end_time,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      if (startTime >= endTime) {
        console.error('❌ 開始時間必須早於結束時間');
        throw new Error('開始時間必須早於結束時間');
      }

      // 計算加班時數
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      
      if (hours <= 0) {
        console.error('❌ 計算出的加班時數無效:', hours);
        throw new Error('加班時數計算錯誤');
      }

      console.log('✅ 計算加班時數:', hours, '小時');

      // 3️⃣ 準備插入資料
      const defaultUserId = '550e8400-e29b-41d4-a716-446655440001';
      const requestData = {
        staff_id: defaultUserId,
        user_id: defaultUserId,
        overtime_type: formData.overtime_type,
        overtime_date: formData.overtime_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        hours: Number(hours.toFixed(2)), // 確保是數字格式
        reason: formData.reason.trim(),
        status: 'pending' as const,
        approval_level: 1
      };

      console.log('📝 準備插入的資料:', requestData);

      // 4️⃣ 驗證 UUID 格式
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(defaultUserId)) {
        console.error('❌ UUID 格式錯誤:', defaultUserId);
        throw new Error('用戶ID格式錯誤');
      }

      // 5️⃣ 執行資料庫插入
      console.log('💾 開始插入資料庫...');
      const { data, error } = await supabase
        .from('overtime_requests')
        .insert(requestData)
        .select()
        .single();

      if (error) {
        console.error('❌ 資料庫插入失敗:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          requestData
        });
        
        // 根據錯誤類型提供更具體的錯誤訊息
        if (error.code === '23502') {
          throw new Error(`必填欄位缺失: ${error.message}`);
        } else if (error.code === '23503') {
          throw new Error(`外鍵約束錯誤: ${error.message}`);
        } else if (error.code === '22P02') {
          throw new Error(`資料格式錯誤: ${error.message}`);
        } else if (error.code === '23514') {
          throw new Error(`檢查約束失敗: ${error.message}`);
        } else {
          throw new Error(`資料庫錯誤 (${error.code}): ${error.message}`);
        }
      }

      console.log('✅ 加班申請插入成功:', data);

      // 6️⃣ 創建審核記錄
      try {
        console.log('📋 開始創建審核記錄...');
        const approvalRecordData = {
          overtime_request_id: data.id,
          approver_name: '系統管理員',
          level: 1,
          status: 'pending' as const,
          comment: '待審核'
        };

        console.log('📋 審核記錄資料:', approvalRecordData);

        const { error: approvalError } = await supabase
          .from('overtime_approval_records')
          .insert(approvalRecordData);

        if (approvalError) {
          console.error('⚠️ 創建審核記錄失敗，但申請已提交:', approvalError);
          // 不拋出錯誤，因為主要申請已成功
        } else {
          console.log('✅ 審核記錄創建成功');
        }
      } catch (approvalRecordError) {
        console.error('⚠️ 審核記錄創建異常:', approvalRecordError);
        // 不影響主流程
      }

      // 7️⃣ 創建通知
      try {
        console.log('🔔 開始創建通知...');
        await this.createOvertimeNotification(data.id, '加班申請已提交', '您的加班申請已提交，等待審核');
        console.log('✅ 通知創建成功');
      } catch (notificationError) {
        console.error('⚠️ 通知創建失敗，但申請已提交:', notificationError);
        // 不影響主流程
      }

      console.log('🎉 加班申請流程完成，申請ID:', data.id);
      return data.id;

    } catch (error) {
      console.error('💥 提交加班申請時發生錯誤:', error);
      
      if (error instanceof Error) {
        throw error; // 重新拋出具體錯誤
      } else {
        throw new Error('提交加班申請時發生未知錯誤');
      }
    }
  },

  // 獲取用戶的加班申請
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    let query = supabase
      .from('overtime_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`staff_id.eq.${userId},user_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 獲取待審核的加班申請
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    const { data, error } = await supabase
      .from('overtime_requests')
      .select(`
        *,
        staff:staff_id (
          name,
          department,
          position
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 審核加班申請
  async approveOvertimeRequest(requestId: string, action: 'approve' | 'reject', comment?: string): Promise<void> {
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    const { error } = await supabase
      .from('overtime_requests')
      .update({ 
        status,
        rejection_reason: action === 'reject' ? comment : null
      })
      .eq('id', requestId);

    if (error) throw error;

    // 創建審核記錄
    await supabase
      .from('overtime_approval_records')
      .insert({
        overtime_request_id: requestId,
        approver_name: '系統管理員', // 提供預設審核人名稱
        level: 1,
        status: action === 'approve' ? 'approved' : 'rejected',
        approval_date: new Date().toISOString(),
        comment
      });

    // 發送通知
    const message = action === 'approve' ? '您的加班申請已通過審核' : '您的加班申請已被拒絕';
    await this.createOvertimeNotification(requestId, '加班申請審核結果', message);
  },

  // 創建通知
  async createOvertimeNotification(requestId: string, title: string, message: string): Promise<void> {
    try {
      const { data: request } = await supabase
        .from('overtime_requests')
        .select('staff_id, user_id')
        .eq('id', requestId)
        .single();

      if (request) {
        const userId = request.staff_id || request.user_id;
        if (userId) {
          await supabase.rpc('create_overtime_notification', {
            p_user_id: userId,
            p_title: title,
            p_message: message,
            p_overtime_request_id: requestId
          });
        }
      }
    } catch (error) {
      console.error('創建通知失敗:', error);
    }
  }
};
