
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

  // 獲取用戶的加班申請 - 改善查詢完整性和錯誤處理
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    try {
      console.log('🔍 查詢用戶加班申請，用戶ID:', userId);
      
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

      if (error) {
        console.error('❌ 查詢加班申請失敗:', error);
        throw error;
      }
      
      console.log('✅ 查詢成功，返回', data?.length || 0, '筆記錄');
      
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
        overtime_approval_records: (item.overtime_approval_records || []).map(record => ({
          ...record,
          status: record.status as 'pending' | 'approved' | 'rejected'
        }))
      }));
    } catch (error) {
      console.error('❌ getUserOvertimeRequests 失敗:', error);
      throw new Error(`載入加班申請失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 獲取待審核的加班申請 - 使用統一查詢邏輯
  async getPendingOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    try {
      if (userId) {
        // 如果提供了用戶ID，獲取該用戶需要審核的申請
        const { overtimeValidationService } = await import('./overtimeValidationService');
        const requests = await overtimeValidationService.getUserApprovalRequests(userId);
        return requests.map(item => ({
          ...item,
          status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
          overtime_approval_records: (item.overtime_approval_records || []).map(record => ({
            ...record,
            status: record.status as 'pending' | 'approved' | 'rejected'
          }))
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
        status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled',
        overtime_approval_records: (item.overtime_approval_records || []).map(record => ({
          ...record,
          status: record.status as 'pending' | 'approved' | 'rejected'
        }))
      }));
    } catch (error) {
      console.error('❌ getPendingOvertimeRequests 失敗:', error);
      throw new Error(`載入待審核申請失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 創建加班申請記錄 - 移除自動核准邏輯，交由觸發器處理
  async createOvertimeRequest(requestData: any): Promise<string> {
    try {
      console.log('💾 創建加班申請記錄:', requestData);
      
      const { data, error } = await supabase
        .from('overtime_requests')
        .insert({
          ...requestData,
          status: 'pending' // 讓觸發器決定是否自動核准
        })
        .select()
        .single();

      if (error) {
        console.error('❌ 創建加班申請失敗:', error);
        throw error;
      }
      
      console.log('✅ 加班申請創建成功:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ createOvertimeRequest 失敗:', error);
      throw new Error(`創建加班申請失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 更新加班申請狀態 - 支持完整審核流程
  async updateOvertimeRequestStatus(
    requestId: string, 
    status: string, 
    rejectionReason?: string,
    approverInfo?: { id: string; name: string },
    comment?: string
  ): Promise<void> {
    try {
      console.log('🔄 更新加班申請狀態:', { requestId, status, rejectionReason, approverInfo, comment });
      
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

      if (error) {
        console.error('❌ 更新加班申請狀態失敗:', error);
        throw error;
      }

      // 更新對應的審核記錄
      if (approverInfo) {
        const { error: recordError } = await supabase
          .from('overtime_approval_records')
          .update({
            status: status === 'approved' ? 'approved' : 'rejected',
            approval_date: new Date().toISOString(),
            comment: comment || null
          })
          .eq('overtime_request_id', requestId)
          .eq('approver_id', approverInfo.id);

        if (recordError) {
          console.error('❌ 更新審核記錄失敗:', recordError);
        }
      }
      
      console.log('✅ 加班申請狀態更新成功');
    } catch (error) {
      console.error('❌ updateOvertimeRequestStatus 失敗:', error);
      throw new Error(`更新申請狀態失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 創建審核記錄 - 保持與請假系統一致
  async createApprovalRecord(recordData: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('overtime_approval_records')
        .insert(recordData);

      if (error) {
        console.error('❌ 創建審核記錄失敗:', error);
        throw error;
      }
    } catch (error) {
      console.error('❌ createApprovalRecord 失敗:', error);
      throw new Error(`創建審核記錄失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 獲取用戶資訊
  async getStaffInfo(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, role, role_id, department, position, supervisor_id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ 獲取用戶資訊失敗:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('❌ getStaffInfo 失敗:', error);
      throw new Error(`獲取用戶資訊失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 獲取用戶下屬
  async getSubordinates(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, position, department')
        .eq('supervisor_id', userId);
      
      if (error) {
        console.error('❌ 獲取下屬資訊失敗:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('❌ getSubordinates 失敗:', error);
      throw new Error(`獲取下屬資訊失敗: ${error.message || '未知錯誤'}`);
    }
  }
};
