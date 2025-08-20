import { RequestStatus } from '@/constants/requestStatus';
import { useToast } from '@/hooks/useToast';
import {
  approveLeaveRequest,
  getCompletedLeaveRequests,
  getPendingLeaveRequests,
  rejectLeaveRequest,
} from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveRequestsStore from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types';
import { useMemo } from 'react';

export const useLeaveRequests = () => {
  const { toast } = useToast();

  const {
    requestsBySlug: requests,
    isAllLoaded,
    setAllLoaded,
    isLoading,
    addRequests,
    addRequestsToMy,
    setMyLoaded,
    updateRequest,
    setLoading,
  } = useLeaveRequestsStore();

  const { employee } = useEmployeeStore();

  const loadPendingLeaveRequests = async () => {
    const statuses = [RequestStatus.PENDING];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);
    const data = await getPendingLeaveRequests();
    if (data.length > 0) {
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    }
    setLoading(false);
    return data;
  };

  const loadCompletedLeaveRequests = async () => {
    const statuses = [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);
    const data = await getCompletedLeaveRequests();
    if (data.length > 0) {
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    }
    setLoading(false);
  };

  // 核准請假申請
  const handleLeaveRequestApprove = async (request: LeaveRequest) => {
    const success = await approveLeaveRequest(request.slug, request.approve_comment);
    if (success) {
      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.APPROVED,
      });

      toast({
        title: '核准成功',
        description: '請假申請已核准',
      });
    }
    return success;
  };

  // 拒絕請假申請
  const handleLeaveRequestReject = async (request: LeaveRequest) => {
    const success = await rejectLeaveRequest(request.slug, request.rejection_reason);

    if (success) {
      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.REJECTED,
      });

      toast({
        title: '拒絕成功',
        description: '請假申請已拒絕',
      });
    }

    return success;
  };

  return {
    // 狀態
    requests,
    isLoading,

    // 操作方法
    loadPendingLeaveRequests,
    loadCompletedLeaveRequests,
    handleLeaveRequestApprove,
    handleLeaveRequestReject,
  };
};

export const useLeavePendingRequests = () => {
  const { requestsBySlug: requests, getRequestsByStatus } = useLeaveRequestsStore();
  return useMemo(() => {
    return getRequestsByStatus([RequestStatus.PENDING]);
  }, [requests]);
};
