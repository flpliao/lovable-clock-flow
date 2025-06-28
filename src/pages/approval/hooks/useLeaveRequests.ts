
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendLeaveStatusNotification } from '@/services/leaveNotificationService';
import { LeaveRequest } from '@/types';

interface LeaveRequestWithApplicant extends LeaveRequest {
  applicant_name?: string;
  approvals?: any[];
}

export const useLeaveRequests = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequestWithApplicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      // Query method 3: Subordinate requests
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
          // Fix the TypeScript error: properly access supervisor_id from staff object
          if (request.staff && request.staff.supervisor_id === currentUser.id) {
            if (!allRequests.some(req => req.id === request.id)) {
              allRequests.push(request);
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
  }, [currentUser?.id, currentUser?.name, toast]);

  const handleApprove = useCallback(async (request: LeaveRequestWithApplicant) => {
    if (!currentUser) return;
    try {
      console.log('🚀 開始核准請假申請:', request.id);
      const { error } = await supabase.from('leave_requests').update({
        status: 'approved',
        updated_at: new Date().toISOString()
      }).eq('id', request.id);
      
      if (error) {
        console.error('❌ 核准請假申請失敗:', error);
        toast({
          title: "核准失敗",
          description: "無法核准請假申請",
          variant: "destructive"
        });
        return;
      }

      // Update approval records
      const { error: approvalError } = await supabase.from('approval_records').update({
        status: 'approved',
        approval_date: new Date().toISOString(),
        comment: '主管核准'
      }).eq('leave_request_id', request.id).eq('approver_id', currentUser.id);
      
      if (approvalError) {
        console.warn('⚠️ 更新審核記錄失敗:', approvalError);
      }

      // Send notification to applicant
      if (request.applicant_name) {
        await sendLeaveStatusNotification(request.user_id, request.applicant_name, request.id, 'approved', currentUser.name || '主管', '主管核准');
      }
      
      console.log('✅ 請假申請核准成功');
      toast({
        title: "核准成功",
        description: "請假申請已核准"
      });

      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
    } catch (error) {
      console.error('❌ 核准請假申請時發生錯誤:', error);
      toast({
        title: "核准失敗",
        description: "核准請假申請時發生錯誤",
        variant: "destructive"
      });
    }
  }, [currentUser, toast]);

  const handleReject = useCallback(async (request: LeaveRequestWithApplicant) => {
    if (!currentUser) return;
    try {
      console.log('🚀 開始拒絕請假申請:', request.id);
      const { error } = await supabase.from('leave_requests').update({
        status: 'rejected',
        rejection_reason: '主管拒絕',
        updated_at: new Date().toISOString()
      }).eq('id', request.id);
      
      if (error) {
        console.error('❌ 拒絕請假申請失敗:', error);
        toast({
          title: "拒絕失敗",
          description: "無法拒絕請假申請",
          variant: "destructive"
        });
        return;
      }

      // Update approval records
      const { error: approvalError } = await supabase.from('approval_records').update({
        status: 'rejected',
        approval_date: new Date().toISOString(),
        comment: '主管拒絕'
      }).eq('leave_request_id', request.id).eq('approver_id', currentUser.id);
      
      if (approvalError) {
        console.warn('⚠️ 更新審核記錄失敗:', approvalError);
      }

      // Send notification to applicant
      if (request.applicant_name) {
        await sendLeaveStatusNotification(request.user_id, request.applicant_name, request.id, 'rejected', currentUser.name || '主管', '主管拒絕');
      }
      
      console.log('✅ 請假申請拒絕成功');
      toast({
        title: "拒絕成功",
        description: "請假申請已拒絕",
        variant: "destructive"
      });

      setPendingRequests(prev => prev.filter(req => req.id !== request.id));
    } catch (error) {
      console.error('❌ 拒絕請假申請時發生錯誤:', error);
      toast({
        title: "拒絕失敗",
        description: "拒絕請假申請時發生錯誤",
        variant: "destructive"
      });
    }
  }, [currentUser, toast]);

  return {
    pendingRequests,
    isLoading,
    refreshing,
    loadPendingRequests,
    handleApprove,
    handleReject,
    setPendingRequests
  };
};
