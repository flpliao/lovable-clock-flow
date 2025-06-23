import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { LeaveRequest } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 載入年假餘額
  const loadAnnualLeaveBalance = async (userId: string) => {
    try {
      console.log('Loading annual leave balance for user:', userId);
      
      if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid user ID format:', userId);
        return null;
      }

      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('hire_date, name, department, position')
        .eq('id', userId)
        .maybeSingle();

      if (staffError) {
        console.error('載入員工資料失敗:', staffError);
        return null;
      }

      if (!staffData || !staffData.hire_date) {
        console.log('員工未設定入職日期，無法計算年假餘額');
        return null;
      }

      console.log('員工資料:', staffData);

      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from('annual_leave_balance')
        .select('*')
        .eq('staff_id', userId)
        .eq('year', currentYear)
        .maybeSingle();

      if (error) {
        console.error('載入年假餘額失敗:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('載入年假餘額失敗:', error);
      return null;
    }
  };

  // 初始化年假餘額
  const initializeAnnualLeaveBalance = async (userId: string) => {
    try {
      console.log('Initializing annual leave balance for user:', userId);
      
      if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid user ID format:', userId);
        return false;
      }

      const currentYear = new Date().getFullYear();
      
      const { error } = await supabase.rpc('initialize_annual_leave_balance', {
        staff_uuid: userId,
        target_year: currentYear
      });

      if (error) {
        console.error('初始化年假餘額失敗:', error);
        return false;
      }

      console.log('年假餘額初始化成功');
      return true;
    } catch (error) {
      console.error('初始化年假餘額失敗:', error);
      return false;
    }
  };

  // 載入請假記錄
  const loadLeaveRequests = async () => {
    if (!currentUser?.id) {
      console.log('No current user, skipping leave requests load');
      setLeaveRequests([]);
      setLoading(false);
      return;
    }

    if (!currentUser.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log('Invalid user ID format, skipping leave requests load');
      setLeaveRequests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading leave requests for user:', currentUser.id);

      // 修正查詢條件，確保能查到所有相關的請假記錄
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*)
        `)
        .or(`user_id.eq.${currentUser.id},staff_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('載入請假記錄失敗:', error);
        setLeaveRequests([]);
        return;
      }

      const formattedRequests: LeaveRequest[] = (data || []).map((request: any) => {
        // 確保日期格式正確，避免時區問題
        const startDate = request.start_date;
        const endDate = request.end_date;
        
        console.log('處理請假記錄日期:', {
          id: request.id,
          originalStartDate: startDate,
          originalEndDate: endDate,
          startDateType: typeof startDate,
          endDateType: typeof endDate
        });

        return {
          id: request.id,
          user_id: request.user_id || request.staff_id,
          start_date: startDate, // 保持原始格式，讓前端處理
          end_date: endDate, // 保持原始格式，讓前端處理
          leave_type: request.leave_type,
          status: request.status,
          hours: Number(request.hours),
          reason: request.reason,
          approval_level: request.approval_level,
          current_approver: request.current_approver,
          created_at: request.created_at,
          updated_at: request.updated_at,
          approved_by: request.approved_by,
          approvals: (request.approval_records || []).map((approval: any) => ({
            id: approval.id,
            leave_request_id: approval.leave_request_id,
            approver_id: approval.approver_id,
            approver_name: approval.approver_name,
            status: approval.status,
            level: approval.level,
            approval_date: approval.approval_date,
            comment: approval.comment
          }))
        };
      });

      setLeaveRequests(formattedRequests);
      console.log('Successfully loaded leave requests:', formattedRequests.length);
      console.log('Leave requests data:', formattedRequests);
    } catch (error) {
      console.error('載入請假記錄失敗:', error);
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // 建立請假申請
  const createLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentUser || !currentUser.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      toast({
        title: "錯誤",
        description: "請先登入或用戶ID無效",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Creating leave request:', request);

      // 建立請假申請，確保日期格式正確
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .insert({
          user_id: currentUser.id,
          staff_id: currentUser.id,
          start_date: request.start_date, // 直接使用 YYYY-MM-DD 格式
          end_date: request.end_date, // 直接使用 YYYY-MM-DD 格式
          leave_type: request.leave_type,
          status: request.status,
          hours: request.hours,
          reason: request.reason,
          approval_level: request.approval_level,
          current_approver: request.current_approver
        })
        .select()
        .single();

      if (leaveError) {
        console.error('建立請假申請失敗:', leaveError);
        throw leaveError;
      }

      console.log('Leave request created successfully:', leaveData);

      // 重新載入請假記錄
      await loadLeaveRequests();
      
      toast({
        title: "申請成功",
        description: "請假申請已送出，等待審核",
      });
      
      return true;
    } catch (error) {
      console.error('建立請假申請失敗:', error);
      toast({
        title: "申請失敗",
        description: "無法提交請假申請",
        variant: "destructive"
      });
      return false;
    }
  };

  const updateLeaveRequestStatus = async (
    requestId: string, 
    status: 'approved' | 'rejected',
    comment?: string,
    rejectionReason?: string
  ) => {
    try {
      console.log('Updating leave request status:', requestId, status);

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        console.error('更新請假狀態失敗:', error);
        throw error;
      }

      await loadLeaveRequests();
      
      toast({
        title: status === 'approved' ? "審核成功" : "拒絕成功",
        description: status === 'approved' ? "請假申請已核准" : "請假申請已拒絕",
      });
      
      return true;
    } catch (error) {
      console.error('更新請假狀態失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新請假狀態",
        variant: "destructive"
      });
      return false;
    }
  };

  const getLeaveHistory = () => {
    return leaveRequests.filter(request => request.user_id === currentUser?.id);
  };

  const manualLoadLeaveRequests = async () => {
    if (currentUser?.id) {
      console.log('Manual load leave requests triggered');
      await loadLeaveRequests();
    }
  };

  const clearAllData = () => {
    console.log('Clearing all leave management data');
    setLeaveRequests([]);
    setLoading(false);
  };

  useEffect(() => {
    clearAllData();
    
    if (currentUser?.id && currentUser.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log('Valid user detected, scheduling leave requests load');
      const timeoutId = setTimeout(() => {
        loadLeaveRequests();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log('No valid user, not loading leave requests');
    }
  }, [currentUser?.id]);

  return {
    leaveRequests,
    loading,
    loadAnnualLeaveBalance,
    initializeAnnualLeaveBalance,
    createLeaveRequest,
    updateLeaveRequestStatus,
    getLeaveHistory,
    refreshData: manualLoadLeaveRequests,
    clearAllData
  };
};
