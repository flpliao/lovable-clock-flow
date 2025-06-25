
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
    // 計算加班時數
    const startTime = new Date(`2000-01-01T${formData.start_time}`);
    const endTime = new Date(`2000-01-01T${formData.end_time}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // 獲取當前用戶資訊
    const currentUserId = '550e8400-e29b-41d4-a716-446655440001'; // 使用預設用戶 ID
    
    // 檢查當前用戶的角色權限 - 只有 admin 或 manager 角色才能自動核准
    const { data: currentUser } = await supabase
      .from('staff')
      .select('role')
      .eq('id', currentUserId)
      .single();

    const isManagerRole = currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager');

    // 如果是管理者角色，再檢查是否有實際下屬
    let hasSubordinates = false;
    if (isManagerRole) {
      const { data: subordinates } = await supabase
        .from('staff')
        .select('id')
        .eq('supervisor_id', currentUserId)
        .limit(1);
      
      hasSubordinates = subordinates && subordinates.length > 0;
    }

    // 只有同時滿足管理者角色且有下屬的用戶才能自動核准
    const canAutoApprove = isManagerRole && hasSubordinates;

    console.log('🔐 加班申請權限檢查:', {
      userId: currentUserId,
      role: currentUser?.role,
      isManagerRole,
      hasSubordinates,
      canAutoApprove
    });

    const requestData = {
      staff_id: currentUserId,
      user_id: currentUserId,
      overtime_type: formData.overtime_type,
      overtime_date: formData.overtime_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      hours,
      reason: formData.reason,
      // 只有具備管理權限且有下屬的用戶才能自動核准
      status: canAutoApprove ? 'approved' as const : 'pending' as const,
      approval_level: 1
    };

    const { data, error } = await supabase
      .from('overtime_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;

    // 根據審核結果發送對應通知
    if (canAutoApprove) {
      await this.createOvertimeNotification(
        data.id, 
        '加班申請已自動核准', 
        '您的加班申請已自動核准（主管權限）'
      );
      console.log('✅ 主管加班申請已自動核准');
    } else {
      await this.createOvertimeNotification(
        data.id, 
        '加班申請已提交', 
        '您的加班申請已提交，等待審核'
      );
      console.log('📋 一般員工加班申請已提交，等待審核');
    }

    return data.id;
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

  // 獲取待審核的加班申請（修正關聯查詢語法）
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    const { data, error } = await supabase
      .from('overtime_requests')
      .select(`
        *,
        staff!staff_id (
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
