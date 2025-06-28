
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sendLeaveStatusNotification } from '@/services/leaveNotificationService';
import type { LeaveRequestWithApplicant, UseLeaveRequestsActionsProps } from './types';

export const useLeaveRequestsActions = ({
  currentUser,
  toast,
  setPendingRequests
}: UseLeaveRequestsActionsProps) => {

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
  }, [currentUser, toast, setPendingRequests]);

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
  }, [currentUser, toast, setPendingRequests]);

  return { handleApprove, handleReject };
};
