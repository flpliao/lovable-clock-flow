import { useCurrentUser } from '@/hooks/useStores';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { ApprovalRecord, LeaveRequest } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface UpdateLeaveRequestData {
  status: 'approved' | 'rejected';
  updated_at: string;
  approval_comment?: string;
  rejection_reason?: string;
}

export const useSupabaseLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const currentUser = useCurrentUser(); // 使用新的 Zustand hook

  // Load leave request data with secure logging
  const loadLeaveRequests = useCallback(async () => {
    if (!currentUser?.id) {
      console.log('❌ useSupabaseLeaveManagement: No current user');
      return;
    }

    setLoading(true);
    try {
      console.log('🔍 useSupabaseLeaveManagement: Loading leave requests for authenticated user');

      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approvals:approval_records(*)
        `)
        .or(`user_id.eq.${currentUser.id},staff_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: Failed to load leave requests:', error.message);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: Successfully loaded leave requests:', data?.length || 0, 'records');
      
      // Ensure leave_type and approvals conform to union types
      const typedData = data?.map(item => ({
        ...item,
        leave_type: item.leave_type as LeaveRequest['leave_type'],
        status: item.status as LeaveRequest['status'],
        approvals: item.approvals?.map((approval: Partial<ApprovalRecord> & Record<string, unknown>) => ({
          ...approval,
          status: approval.status as ApprovalRecord['status']
        })) || []
      })) || [];
      
      setLeaveRequests(typedData);
    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error loading leave requests:', error);
      toast({
        title: "Loading Failed",
        description: "Unable to load leave request data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, toast]);

  // Helper function to get staff information with secure data handling
  const getStaffInfo = useCallback(async (userId: string) => {
    console.log('🔍 useSupabaseLeaveManagement: Getting staff information for authenticated user');
    
    try {
      // First try to find by user_id
      const { data: staffByUserId, error: userIdError } = await supabase
        .from('staff')
        .select('id, user_id, name, department, supervisor_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (staffByUserId && !userIdError) {
        console.log('✅ Found staff data by user_id');
        return staffByUserId;
      }

      // If not found by user_id, try by id
      const { data: staffById, error: idError } = await supabase
        .from('staff')
        .select('id, user_id, name, department, supervisor_id')
        .eq('id', userId)
        .maybeSingle();

      if (staffById && !idError) {
        console.log('✅ Found staff data by id');
        return staffById;
      }

      console.error('❌ Unable to find staff data');
      return null;
    } catch (error) {
      console.error('❌ Error getting staff information:', error);
      return null;
    }
  }, []);

  // Create leave request with enhanced security validation and simplified ID handling
  const createLeaveRequest = useCallback(async (newRequest: Omit<LeaveRequest, 'id'>): Promise<boolean> => {
    if (!currentUser?.id) {
      console.error('❌ useSupabaseLeaveManagement: Failed to create leave request - no current user');
      toast({
        title: "提交失敗",
        description: "請先登入系統",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('🚀 useSupabaseLeaveManagement: Starting to create leave request');

      // Check user authentication status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('❌ User authentication failed:', authError?.message);
        toast({
          title: "認證失敗",
          description: "用戶認證已過期，請重新登入",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ User authentication confirmed');

      // Get staff data to ensure correct staff_id
      const staffInfo = await getStaffInfo(currentUser.id);
      
      // Prepare insert data with flexible ID handling
      const requestData = {
        ...newRequest,
        // Use currentUser.id as the primary identifier
        user_id: currentUser.id,
        // Use staff table ID if available, otherwise use currentUser.id
        staff_id: staffInfo?.id || currentUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Remove unnecessary fields using proper typing
      const { approvals, id, ...cleanRequestData } = requestData as typeof requestData & { 
        approvals?: ApprovalRecord[]; 
        id?: string; 
      };

      console.log('📝 useSupabaseLeaveManagement: Prepared data for insertion:', {
        user_id: cleanRequestData.user_id,
        staff_id: cleanRequestData.staff_id,
        leave_type: cleanRequestData.leave_type,
        start_date: cleanRequestData.start_date,
        end_date: cleanRequestData.end_date
      });

      // Insert leave request
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([cleanRequestData])
        .select()
        .single();

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: Failed to insert leave request:', {
          error: error.message,
          code: error.code,
          details: error.details
        });
        
        // Provide specific error messages based on error type
        let errorMessage = "無法提交請假申請";
        let errorTitle = "申請失敗";

        if (error.code === '23503') {
          errorMessage = "資料關聯錯誤，請聯繫系統管理員檢查帳號設定";
          errorTitle = "資料關聯錯誤";
        } else if (error.code === 'PGRST301') {
          errorMessage = "提交請假申請權限不足。請確認您已正常登入且擁有相關權限。";
          errorTitle = "權限錯誤";
        } else if (error.code === '23502') {
          errorMessage = "資料不完整，請檢查所有必填欄位是否已填寫。";
          errorTitle = "資料驗證失敗";
        } else if (error.message.includes('row-level security')) {
          errorMessage = "安全政策限制，無法提交請假申請。請聯繫系統管理員檢查權限設定。";
          errorTitle = "安全政策錯誤";
        } else if (error.message.includes('violates')) {
          errorMessage = "資料驗證失敗，請檢查輸入內容是否符合要求。";
          errorTitle = "資料驗證失敗";
        }

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ useSupabaseLeaveManagement: Leave request created successfully');

      // If there are approvers, create approval records
      if (newRequest.approvals && newRequest.approvals.length > 0) {
        console.log('📝 useSupabaseLeaveManagement: Creating approval records...');
        
        const approvalRecords = newRequest.approvals.map(approval => ({
          ...approval,
          leave_request_id: data.id,
          id: undefined // Let database auto-generate
        }));

        const { error: approvalError } = await supabase
          .from('approval_records')
          .insert(approvalRecords);

        if (approvalError) {
          console.warn('⚠️ useSupabaseLeaveManagement: Failed to create approval records:', approvalError.message);
        } else {
          console.log('✅ useSupabaseLeaveManagement: Approval records created successfully');
        }
      }

      toast({
        title: "申請成功",
        description: "請假申請已提交，等待審核",
      });

      // Reload leave request list
      await loadLeaveRequests();
      return true;

    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error creating leave request:', error);
      toast({
        title: "提交失敗",
        description: "系統發生錯誤，請稍後再試或聯繫系統管理員",
        variant: "destructive",
      });
      return false;
    }
  }, [currentUser?.id, toast, loadLeaveRequests, getStaffInfo]);

  // Load annual leave balance with secure data access
  const loadAnnualLeaveBalance = useCallback(async (userId: string) => {
    try {
      console.log('🔍 useSupabaseLeaveManagement: Loading annual leave balance for authenticated user');
      
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from('annual_leave_balance')
        .select('*')
        .eq('staff_id', userId)
        .eq('year', currentYear)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('❌ useSupabaseLeaveManagement: Failed to load annual leave balance:', error.message);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: Annual leave balance loading result');
      return data;
    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error loading annual leave balance:', error);
      return null;
    }
  }, []);

  // Initialize annual leave balance
  const initializeAnnualLeaveBalance = useCallback(async (userId: string) => {
    try {
      console.log('🚀 useSupabaseLeaveManagement: Initializing annual leave balance for authenticated user');
      
      const currentYear = new Date().getFullYear();
      
      // Call Supabase function to initialize annual leave balance
      const { error } = await supabase.rpc('initialize_or_update_annual_leave_balance', {
        staff_uuid: userId,
        target_year: currentYear
      });

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: Failed to initialize annual leave balance:', error.message);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: Annual leave balance initialized successfully');
    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error initializing annual leave balance:', error);
      throw error;
    }
  }, []);

  // Update leave request status with secure validation
  const updateLeaveRequestStatus = useCallback(async (
    requestId: string,
    status: 'approved' | 'rejected',
    comment?: string,
    rejectionReason?: string
  ): Promise<boolean> => {
    try {
      console.log('🔄 useSupabaseLeaveManagement: Updating leave request status');

      const updateData: UpdateLeaveRequestData = {
        status,
        updated_at: new Date().toISOString()
      };

      if (comment) updateData.approval_comment = comment;
      if (rejectionReason) updateData.rejection_reason = rejectionReason;

      const { error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: Failed to update leave request status:', error.message);
        throw error;
      }

      console.log('✅ useSupabaseLeaveManagement: Leave request status updated successfully');
      
      toast({
        title: "更新成功",
        description: `請假申請已${status === 'approved' ? '核准' : '拒絕'}`,
      });

      // Reload leave request list
      await loadLeaveRequests();
      return true;

    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error updating leave request status:', error);
      toast({
        title: "更新失敗",
        description: "無法更新請假申請狀態",
        variant: "destructive",
      });
      return false;
    }
  }, [toast, loadLeaveRequests]);

  // Refresh data
  const refreshData = useCallback(async () => {
    await loadLeaveRequests();
  }, [loadLeaveRequests]);

  // Load data when component mounts
  useEffect(() => {
    if (currentUser?.id) {
      loadLeaveRequests();
    }
  }, [currentUser?.id, loadLeaveRequests]);

  return {
    leaveRequests,
    loading,
    createLeaveRequest,
    updateLeaveRequestStatus,
    refreshData,
    loadAnnualLeaveBalance,
    initializeAnnualLeaveBalance
  };
};
