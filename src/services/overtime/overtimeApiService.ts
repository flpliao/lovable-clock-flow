
import { supabase } from '@/integrations/supabase/client';
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';

export const overtimeApiService = {
  // 獲取加班類型 - 使用 JWT token 進行身份驗證
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    console.log('🔍 使用 Supabase Auth 獲取加班類型');
    
    const { data, error } = await supabase
      .from('overtime_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('❌ 獲取加班類型失敗:', error);
      throw error;
    }
    
    console.log('✅ 成功獲取加班類型:', data?.length || 0, '筆');
    
    return (data || []).map(item => ({
      ...item,
      compensation_type: item.compensation_type as 'overtime_pay' | 'compensatory_time',
      description: item.description || undefined,
      special_rules: (typeof item.special_rules === 'object' && item.special_rules !== null) 
        ? item.special_rules as Record<string, any>
        : {} as Record<string, any>
    }));
  },

  // 獲取用戶的加班申請 - 使用 JWT token 身份驗證
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    try {
      console.log('🔍 使用 Supabase Auth 查詢用戶加班申請');
      
      // 獲取當前認證用戶
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ 無法獲取當前用戶:', authError);
        throw new Error('用戶未認證');
      }
      
      console.log('👤 當前認證用戶:', user.id);
      
      // 使用當前認證用戶的 ID 查詢
      const targetUserId = userId || user.id;
      
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
        .or(`staff_id.eq.${targetUserId},user_id.eq.${targetUserId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢加班申請失敗:', error);
        throw error;
      }
      
      console.log('✅ 查詢成功，返回', data?.length || 0, '筆記錄');
      console.log('📋 查詢條件 - 目標用戶ID:', targetUserId);
      console.log('📋 查詢結果預覽:', data?.slice(0, 3)?.map(r => ({
        id: r.id,
        staff_id: r.staff_id,
        user_id: r.user_id,
        overtime_date: r.overtime_date,
        status: r.status
      })));
      
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

  // 獲取待審核的加班申請 - 使用 JWT token 身份驗證
  async getPendingOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    try {
      console.log('🔍 使用 Supabase Auth 查詢待審核加班申請');
      
      // 獲取當前認證用戶
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ 無法獲取當前用戶:', authError);
        throw new Error('用戶未認證');
      }
      
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

      // 否則獲取所有待審核申請（使用 JWT token 的 RLS 權限）
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

      if (error) {
        console.error('❌ 查詢待審核申請失敗:', error);
        throw error;
      }
      
      console.log('✅ 查詢待審核申請成功:', data?.length || 0, '筆');
      
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

  // 創建加班申請記錄 - 使用 JWT token 進行身份驗證
  async createOvertimeRequest(requestData: any): Promise<string> {
    try {
      console.log('💾 使用 Supabase Auth 創建加班申請記錄');
      
      // 獲取當前認證用戶
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ 無法獲取當前用戶:', authError);
        throw new Error('用戶未認證');
      }
      
      console.log('👤 當前認證用戶:', user.id);
      console.log('📝 申請資料:', requestData);
      
      const { data, error } = await supabase
        .from('overtime_requests')
        .insert({
          ...requestData,
          staff_id: user.id, // 使用認證用戶的ID
          user_id: user.id,  // 確保 RLS 權限正確
          status: 'pending'
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

  // 更新加班申請狀態 - 使用 JWT token 進行身份驗證
  async updateOvertimeRequestStatus(
    requestId: string, 
    status: string, 
    rejectionReason?: string,
    approverInfo?: { id: string; name: string },
    comment?: string
  ): Promise<void> {
    try {
      console.log('🔄 使用 Supabase Auth 更新加班申請狀態');
      
      // 獲取當前認證用戶
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ 無法獲取當前用戶:', authError);
        throw new Error('用戶未認證');
      }
      
      console.log('👤 當前認證用戶:', user.id);
      console.log('🔄 更新申請狀態:', { requestId, status, rejectionReason, approverInfo, comment });
      
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
        } else {
          // 使用當前認證用戶作為審核者
          updateData.approved_by = user.id;
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
      const approverId = approverInfo?.id || user.id;
      const { error: recordError } = await supabase
        .from('overtime_approval_records')
        .update({
          status: status === 'approved' ? 'approved' : 'rejected',
          approval_date: new Date().toISOString(),
          comment: comment || null
        })
        .eq('overtime_request_id', requestId)
        .eq('approver_id', approverId);

      if (recordError) {
        console.error('❌ 更新審核記錄失敗:', recordError);
      }
      
      console.log('✅ 加班申請狀態更新成功');
    } catch (error) {
      console.error('❌ updateOvertimeRequestStatus 失敗:', error);
      throw new Error(`更新申請狀態失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 創建審核記錄 - 使用 JWT token 進行身份驗證
  async createApprovalRecord(recordData: any): Promise<void> {
    try {
      console.log('💾 使用 Supabase Auth 創建審核記錄');
      
      const { error } = await supabase
        .from('overtime_approval_records')
        .insert(recordData);

      if (error) {
        console.error('❌ 創建審核記錄失敗:', error);
        throw error;
      }
      
      console.log('✅ 審核記錄創建成功');
    } catch (error) {
      console.error('❌ createApprovalRecord 失敗:', error);
      throw new Error(`創建審核記錄失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 獲取用戶資訊 - 使用 JWT token 進行身份驗證
  async getStaffInfo(userId: string): Promise<any> {
    try {
      console.log('🔍 使用 Supabase Auth 獲取用戶資訊:', userId);
      
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, role, role_id, department, position, supervisor_id')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ 獲取用戶資訊失敗:', error);
        throw error;
      }
      
      console.log('✅ 獲取用戶資訊成功:', data.name);
      return data;
    } catch (error) {
      console.error('❌ getStaffInfo 失敗:', error);
      throw new Error(`獲取用戶資訊失敗: ${error.message || '未知錯誤'}`);
    }
  },

  // 獲取用戶下屬 - 使用 JWT token 進行身份驗證
  async getSubordinates(userId: string): Promise<any[]> {
    try {
      console.log('🔍 使用 Supabase Auth 獲取下屬資訊:', userId);
      
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, position, department')
        .eq('supervisor_id', userId);
      
      if (error) {
        console.error('❌ 獲取下屬資訊失敗:', error);
        throw error;
      }
      
      console.log('✅ 獲取下屬資訊成功:', data?.length || 0, '筆');
      return data || [];
    } catch (error) {
      console.error('❌ getSubordinates 失敗:', error);
      throw new Error(`獲取下屬資訊失敗: ${error.message || '未知錯誤'}`);
    }
  }
};
