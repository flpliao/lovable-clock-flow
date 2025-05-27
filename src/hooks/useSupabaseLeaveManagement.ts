
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRequest, ApprovalRecord } from '@/types';

export const useSupabaseLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useUser();

  // 載入請假申請資料
  const loadLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        setLeaveRequests([]);
        return;
      }

      const formattedRequests = (data || []).map((request: any) => ({
        id: request.id,
        user_id: request.user_id,
        staff_id: request.staff_id,
        start_date: request.start_date,
        end_date: request.end_date,
        leave_type: request.leave_type,
        status: request.status,
        hours: request.hours,
        reason: request.reason,
        approval_level: request.approval_level,
        current_approver: request.current_approver,
        rejection_reason: request.rejection_reason,
        created_at: request.created_at,
        updated_at: request.updated_at,
        approvals: (request.approval_records || []).map((record: any) => ({
          id: record.id,
          leave_request_id: record.leave_request_id,
          approver_id: record.approver_id,
          approver_name: record.approver_name,
          status: record.status,
          comment: record.comment,
          approval_date: record.approval_date,
          level: record.level
        }))
      }));

      setLeaveRequests(formattedRequests);
    } catch (error) {
      console.error('載入請假申請失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入請假申請資料",
        variant: "destructive"
      });
      setLeaveRequests([]);
    }
  };

  // 載入年假餘額
  const loadAnnualLeaveBalance = async (staffId: string) => {
    try {
      const currentYear = new Date().getFullYear();
      const { data, error } = await supabase
        .from('annual_leave_balance')
        .select('*')
        .eq('staff_id', staffId)
        .eq('year', currentYear)
        .maybeSingle();

      if (error) {
        console.error('年假餘額查詢錯誤:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('載入年假餘額失敗:', error);
      return null;
    }
  };

  // 建立請假申請
  const createLeaveRequest = async (newRequest: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentUser) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: currentUser.id,
          staff_id: currentUser.id,
          start_date: newRequest.start_date,
          end_date: newRequest.end_date,
          leave_type: newRequest.leave_type,
          status: newRequest.status,
          hours: newRequest.hours,
          reason: newRequest.reason,
          approval_level: newRequest.approval_level,
          current_approver: newRequest.current_approver
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // 如果有審核流程，建立審核記錄
      if (newRequest.approvals && newRequest.approvals.length > 0) {
        const approvalRecords = newRequest.approvals.map(approval => ({
          leave_request_id: data.id,
          approver_id: approval.approver_id,
          approver_name: approval.approver_name,
          status: 'pending' as const,
          level: approval.level
        }));

        await supabase
          .from('approval_records')
          .insert(approvalRecords);
      }

      await loadLeaveRequests();
      
      toast({
        title: "申請成功",
        description: "請假申請已成功送出",
      });
      
      return true;
    } catch (error) {
      console.error('建立請假申請失敗:', error);
      toast({
        title: "申請失敗",
        description: "無法建立請假申請",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新請假申請狀態
  const updateLeaveRequestStatus = async (requestId: string, status: 'approved' | 'rejected', comment?: string, rejectionReason?: string) => {
    try {
      const updateData: any = { status };
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // 更新審核記錄
      if (currentUser) {
        await supabase
          .from('approval_records')
          .update({
            status,
            comment,
            approval_date: new Date().toISOString()
          })
          .eq('leave_request_id', requestId)
          .eq('approver_id', currentUser.id);
      }

      await loadLeaveRequests();
      
      toast({
        title: status === 'approved' ? "審核通過" : "審核拒絕",
        description: `請假申請已${status === 'approved' ? '核准' : '拒絕'}`,
      });
      
      return true;
    } catch (error) {
      console.error('更新請假申請失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新請假申請狀態",
        variant: "destructive"
      });
      return false;
    }
  };

  // 初始化年假餘額
  const initializeAnnualLeaveBalance = async (staffId: string) => {
    try {
      const currentYear = new Date().getFullYear();
      const { error } = await supabase.rpc('initialize_annual_leave_balance', {
        staff_uuid: staffId,
        target_year: currentYear
      });

      if (error) {
        console.error('初始化年假餘額失敗:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('初始化年假餘額失敗:', error);
      return false;
    }
  };

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadLeaveRequests();
      
      // 如果有當前使用者，初始化其年假餘額
      if (currentUser) {
        await initializeAnnualLeaveBalance(currentUser.id);
      }
      
      setLoading(false);
    };
    loadData();
  }, [currentUser]);

  return {
    leaveRequests,
    loading,
    createLeaveRequest,
    updateLeaveRequestStatus,
    loadAnnualLeaveBalance,
    initializeAnnualLeaveBalance,
    refreshData: loadLeaveRequests
  };
};
