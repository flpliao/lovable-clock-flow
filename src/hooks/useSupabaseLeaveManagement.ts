
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRequest, ApprovalRecord } from '@/types';
import { useUser } from '@/contexts/UserContext';

export const useSupabaseLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();

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
        approvals: item.approvals?.map((approval: any) => ({
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

  // Create leave request with enhanced security validation
  const createLeaveRequest = useCallback(async (newRequest: Omit<LeaveRequest, 'id'>): Promise<boolean> => {
    if (!currentUser?.id) {
      console.error('❌ useSupabaseLeaveManagement: Failed to create leave request - no current user');
      toast({
        title: "Submission Failed",
        description: "Please log in to the system first",
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
          title: "Authentication Failed",
          description: "User authentication has expired, please log in again",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ User authentication confirmed');

      // Get staff data to ensure correct staff_id
      const staffInfo = await getStaffInfo(currentUser.id);
      if (!staffInfo) {
        console.error('❌ Staff data record not found');
        toast({
          title: "Data Validation Failed",
          description: "Your staff data record was not found, please contact administrator for account setup",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Staff data validation successful');

      // Prepare insert data using correct staff_id
      const requestData = {
        ...newRequest,
        user_id: currentUser.id,
        staff_id: staffInfo.id, // Use correct ID from staff table
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Remove unnecessary fields
      delete (requestData as any).approvals;
      delete (requestData as any).id;

      console.log('📝 useSupabaseLeaveManagement: Prepared data for insertion');

      // Insert leave request
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([requestData])
        .select()
        .single();

      if (error) {
        console.error('❌ useSupabaseLeaveManagement: Failed to insert leave request:', {
          error: error.message,
          code: error.code
        });
        
        // Provide specific error messages based on error type
        let errorMessage = "Unable to submit leave request";
        let errorTitle = "Application Failed";

        if (error.code === '23503') {
          if (error.message.includes('staff_id_fkey')) {
            errorMessage = "Staff data association error, please contact system administrator to check account setup";
            errorTitle = "Data Association Error";
          } else if (error.message.includes('leave_type')) {
            errorMessage = "Leave type setting error, please reselect leave type";
            errorTitle = "Leave Type Error";
          } else {
            errorMessage = "Data association error, please check input content or contact system administrator";
            errorTitle = "Data Association Error";
          }
        } else if (error.code === 'PGRST301') {
          errorMessage = "Insufficient permissions to submit leave request. Please confirm you are properly logged in and have relevant permissions.";
          errorTitle = "Permission Error";
        } else if (error.code === '23502') {
          errorMessage = "Incomplete data, please check all required fields are filled.";
          errorTitle = "Data Validation Failed";
        } else if (error.message.includes('row-level security')) {
          errorMessage = "Security policy restriction, unable to submit leave request. Please contact system administrator to check permission settings.";
          errorTitle = "Security Policy Error";
        } else if (error.message.includes('violates')) {
          errorMessage = "Data validation failed, please check if input content meets requirements.";
          errorTitle = "Data Validation Failed";
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
        title: "Application Successful",
        description: "Leave request has been submitted, awaiting approval",
      });

      // Reload leave request list
      await loadLeaveRequests();
      return true;

    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error creating leave request:', error);
      toast({
        title: "Submission Failed",
        description: "System error occurred, please try again later or contact system administrator",
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

      const updateData: any = {
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
        title: "Update Successful",
        description: `Leave request has been ${status === 'approved' ? 'approved' : 'rejected'}`,
      });

      // Reload leave request list
      await loadLeaveRequests();
      return true;

    } catch (error) {
      console.error('❌ useSupabaseLeaveManagement: Error updating leave request status:', error);
      toast({
        title: "Update Failed",
        description: "Unable to update leave request status",
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
