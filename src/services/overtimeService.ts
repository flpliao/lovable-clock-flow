
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
      compensation_type: item.compensation_type as 'overtime_pay' | 'compensatory_time'
    }));
  },

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('用戶未登入');

    // 計算加班時數
    const startTime = new Date(`2000-01-01T${formData.start_time}`);
    const endTime = new Date(`2000-01-01T${formData.end_time}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    const requestData = {
      staff_id: userData.user.id,
      user_id: userData.user.id,
      overtime_type: formData.overtime_type,
      overtime_date: formData.overtime_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      hours,
      reason: formData.reason,
      status: 'pending' as const,
      approval_level: 1
    };

    const { data, error } = await supabase
      .from('overtime_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;

    // 創建通知
    await this.createOvertimeNotification(data.id, '加班申請已提交', '您的加班申請已提交，等待審核');

    return data.id;
  },

  // 獲取用戶的加班申請
  async getUserOvertimeRequests(userId: string): Promise<OvertimeRequest[]> {
    const { data, error } = await supabase
      .from('overtime_requests')
      .select('*')
      .or(`staff_id.eq.${userId},user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // 添加類型轉換確保類型安全
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 獲取待審核的加班申請
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('用戶未登入');

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
      .or(`current_approver.eq.${userData.user.id},staff_id.in.(select id from staff where supervisor_id = '${userData.user.id}')`)
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
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('用戶未登入');

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
        approver_id: userData.user.id,
        approver_name: '審核人', // 實際應該從用戶資料獲取
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
