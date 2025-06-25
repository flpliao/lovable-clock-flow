
import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeApiService = {
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

  // 創建加班申請記錄
  async createOvertimeRequest(requestData: any): Promise<string> {
    const { data, error } = await supabase
      .from('overtime_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  // 更新加班申請狀態
  async updateOvertimeRequestStatus(requestId: string, status: string, rejectionReason?: string): Promise<void> {
    const { error } = await supabase
      .from('overtime_requests')
      .update({ 
        status,
        rejection_reason: rejectionReason || null
      })
      .eq('id', requestId);

    if (error) throw error;
  },

  // 創建審核記錄
  async createApprovalRecord(recordData: any): Promise<void> {
    const { error } = await supabase
      .from('overtime_approval_records')
      .insert(recordData);

    if (error) throw error;
  },

  // 獲取用戶資訊
  async getStaffInfo(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, role, role_id, department, position')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // 獲取用戶下屬
  async getSubordinates(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, position, department')
      .eq('supervisor_id', userId);
    
    if (error) throw error;
    return data || [];
  }
};
