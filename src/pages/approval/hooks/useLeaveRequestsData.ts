
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LeaveRequest } from '@/types';
import type { LeaveRequestWithApplicant, UseLeaveRequestsDataProps } from './types';

export const useLeaveRequestsData = ({
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
    console.log('🔍 載入待審核請假申請，當前用戶:', currentUser.id, currentUser.name);
    try {
      setRefreshing(true);

      // Query method 1: Requests directly assigned to current user
      const { data: directRequests, error: directError } = await supabase.from('leave_requests').select(`
          *,
          approval_records (*),
          staff!leave_requests_user_id_fkey(name)
        `).eq('status', 'pending').eq('current_approver', currentUser.id);
      if (directError) {
        console.error('❌ 查詢直接指派的申請失敗:', directError);
      }

      // Query method 2: Requests from approval records
      const { data: approvalRequests, error: approvalError } = await supabase.from('approval_records').select(`
          leave_request_id,
          leave_requests!inner(
            *,
            approval_records (*),
            staff!leave_requests_user_id_fkey(name)
          )
        `).eq('approver_id', currentUser.id).eq('status', 'pending');
      if (approvalError) {
        console.error('❌ 查詢審核記錄申請失敗:', approvalError);
      }

      // Query method 3: Subordinate requests - Fix the select to get supervisor_id
      const { data: subordinateRequests, error: subordinateError } = await supabase.from('leave_requests').select(`
          *,
          approval_records (*),
          staff!leave_requests_user_id_fkey(name, supervisor_id)
        `).eq('status', 'pending');
      if (subordinateError) {
        console.error('❌ 查詢下屬申請失敗:', subordinateError);
      }

      // Merge and deduplicate results
      const allRequests = [];

      if (directRequests) {
        allRequests.push(...directRequests);
      }

      if (approvalRequests) {
        approvalRequests.forEach(record => {
          if (record.leave_requests && !allRequests.some(req => req.id === record.leave_requests.id)) {
            allRequests.push(record.leave_requests);
          }
        });
      }

      if (subordinateRequests) {
        subordinateRequests.forEach(request => {
          // Fix the TypeScript error: properly check if staff exists and has supervisor_id
          if (request.staff && typeof request.staff === 'object' && !Array.isArray(request.staff)) {
            if ((request.staff as any).supervisor_id === currentUser.id) {
              if (!allRequests.some(req => req.id === request.id)) {
                allRequests.push(request);
              }
            }
          }
        });
      }

      console.log('✅ 成功載入待審核請假申請:', allRequests.length, '筆');
      console.log('📋 請假申請詳細資料:', allRequests);
      
      const formattedRequests: LeaveRequestWithApplicant[] = allRequests.map((request: any) => ({
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
