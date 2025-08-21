
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRequest } from '@/types';
import type { LeaveRequestWithApplicant, UseLeaveRequestsDataProps } from './types';

export const useOptimizedLeaveRequestsData = ({
  currentUser,
  toast,
  setPendingRequests,
  setIsLoading,
  setRefreshing
}: UseLeaveRequestsDataProps) => {

  const loadPendingRequests = useCallback(async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }
    
    console.log('🔍 使用優化後的 RLS 政策載入待審核請假申請...');
    
    try {
      setRefreshing(true);

      // 使用優化後的查詢 - 讓 RLS 政策自動處理權限篩選
      const { data: leaveRequests, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*),
          staff!leave_requests_user_id_fkey(name, supervisor_id)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 查詢請假申請失敗:', error);
        toast({
          title: "載入失敗",
          description: "載入待審核請假申請時發生錯誤",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ 成功載入待審核請假申請 (優化後):', leaveRequests?.length || 0, '筆');
      console.log('📋 請假申請詳細資料:', leaveRequests);
      
      const formattedRequests: LeaveRequestWithApplicant[] = (leaveRequests || []).map((request: any) => ({
        id: request.id,
        user_id: request.user_id || request.staff_id,
        start_date: request.start_date,
        end_date: request.end_date,
        leave_type: request.leave_type as LeaveRequest['leave_type'],
        status: request.status as LeaveRequest['status'],
        hours: Number(request.hours),
        reason: request.reason,
        approval_level: request.approval_level,
        current_approver: request.current_approver,
        created_at: request.created_at,
        updated_at: request.updated_at,
        applicant_name: request.staff?.name || '未知申請人',
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
      
      setPendingRequests(formattedRequests);
      
    } catch (error) {
      console.error('❌ 載入待審核請假申請時發生錯誤:', error);
      toast({
        title: "載入失敗",
        description: "載入待審核請假申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [currentUser?.id, currentUser?.name, toast, setPendingRequests, setIsLoading, setRefreshing]);

  return { loadPendingRequests };
};
