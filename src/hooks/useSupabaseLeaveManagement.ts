
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { LeaveRequest } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 載入年假餘額
  const loadAnnualLeaveBalance = async (userId: string) => {
    try {
      console.log('Loading annual leave balance for user:', userId);
      
      // 檢查 userId 是否為有效的 UUID 格式
      if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid user ID format:', userId);
        return null;
      }

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
      
      // 檢查 userId 是否為有效的 UUID 格式
      if (!userId || !userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('Invalid user ID format:', userId);
        return false;
      }

      const currentYear = new Date().getFullYear();
      
      // 呼叫 Supabase 函數初始化年假餘額
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
    // 檢查用戶是否存在且有有效的 UUID
    if (!currentUser || !currentUser.id || !currentUser.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log('No valid current user, skipping leave requests load');
      setLeaveRequests([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading leave requests for user:', currentUser.id);

      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*)
        `)
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('載入請假記錄失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入請假記錄",
          variant: "destructive"
        });
        return;
      }

      // 轉換資料格式以符合前端介面
      const formattedRequests: LeaveRequest[] = (data || []).map((request: any) => ({
        id: request.id,
        user_id: request.user_id,
        start_date: request.start_date,
        end_date: request.end_date,
        leave_type: request.leave_type,
        status: request.status,
        hours: Number(request.hours),
        reason: request.reason,
        approval_level: request.approval_level,
        current_approver: request.current_approver,
        created_at: request.created_at,
        updated_at: request.updated_at,
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
      }));

      setLeaveRequests(formattedRequests);
    } catch (error) {
      console.error('載入請假記錄失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入請假記錄",
        variant: "destructive"
      });
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

      // 建立請假申請
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .insert({
          user_id: currentUser.id,
          start_date: request.start_date,
          end_date: request.end_date,
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

      // 建立審批記錄
      if (request.approvals && request.approvals.length > 0) {
        const approvalRecords = request.approvals.map(approval => ({
          leave_request_id: leaveData.id,
          approver_id: approval.approver_id,
          approver_name: approval.approver_name,
          status: approval.status,
          level: approval.level
        }));

        const { error: approvalError } = await supabase
          .from('approval_records')
          .insert(approvalRecords);

        if (approvalError) {
          console.error('建立審批記錄失敗:', approvalError);
          // 不拋出錯誤，因為請假申請已成功建立
        }
      }

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

  // 更新請假申請狀態
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

  // 初始載入 - 僅在有有效用戶時載入
  useEffect(() => {
    if (currentUser && currentUser.id && currentUser.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log('Valid user detected, loading leave requests');
      loadLeaveRequests();
    } else {
      console.log('No valid user, setting loading to false');
      setLoading(false);
      setLeaveRequests([]);
    }
  }, [currentUser]);

  return {
    leaveRequests,
    loading,
    loadAnnualLeaveBalance,
    initializeAnnualLeaveBalance,
    createLeaveRequest,
    updateLeaveRequestStatus,
    refreshData: loadLeaveRequests
  };
};
