
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
    
    return (data || []).map(item => ({
      ...item,
      compensation_type: item.compensation_type as 'overtime_pay' | 'compensatory_time',
      description: item.description || undefined,
      special_rules: (typeof item.special_rules === 'object' && item.special_rules !== null) 
        ? item.special_rules as Record<string, any>
        : {} as Record<string, any>
    }));
  },

  // 獲取用戶的加班申請 - 改善查詢完整性
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    let query = supabase
      .from('overtime_requests')
      .select(`
        *,
        staff!staff_id (
          name,
          department,
          position
        ),
        overtime_approval_records (
          id,
          overtime_request_id,
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
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.or(`staff_id.eq.${userId},user_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 獲取待審核的加班申請 - 使用統一查詢邏輯
  async getPendingOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    if (userId) {
      // 如果提供了用戶ID，獲取該用戶需要審核的申請
      const { overtimeValidationService } = await import('./overtimeValidationService');
      const requests = await overtimeValidationService.getUserApprovalRequests(userId);
      return requests.map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
      }));
    }

    // 否則獲取所有待審核申請
    const { data, error } = await supabase
      .from('overtime_requests')
      .select(`
        *,
        staff!staff_id (
          name,
          department,
          position
        ),
        overtime_approval_records (
          id,
          overtime_request_id,
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
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 創建加班申請記錄 - 移除自動核准邏輯，交由觸發器處理
  async createOvertimeRequest(requestData: any): Promise<string> {
    const { data, error } = await supabase
      .from('overtime_requests')
      .insert({
        ...requestData,
        status: 'pending' // 讓觸發器決定是否自動核准
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  // 更新加班申請狀態 - 支援完整審核流程
  async updateOvertimeRequestStatus(
    requestId: string, 
    status: string, 
    rejectionReason?: string,
    approverInfo?: { id: string; name: string },
    comment?: string
  ): Promise<void> {
    const updateData: any = { 
      status,
      rejection_reason: rejectionReason || null
    };

    // 如果是核准或拒絕，記錄審核資訊
    if (status === 'approved' || status === 'rejected') {
      updateData.approval_date = new Date().toISOString();
      updateData.approval_comment = comment || null;
      
      if (approverInfo) {
        updateData.approved_by = approverInfo.id;
        updateData.approved_by_name = approverInfo.name;
      }
    }

    const { error } = await supabase
      .from('overtime_requests')
      .update(updateData)
      .eq('id', requestId);

    if (error) throw error;

    // 更新對應的審核記錄
    if (approverInfo) {
      await supabase
        .from('overtime_approval_records')
        .update({
          status: status === 'approved' ? 'approved' : 'rejected',
          approval_date: new Date().toISOString(),
          comment: comment || null
        })
        .eq('overtime_request_id', requestId)
        .eq('approver_id', approverInfo.id);
    }
  },

  // 創建審核記錄 - 保持與請假系統一致
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
      .select('id, name, role, role_id, department, position, supervisor_id')
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
