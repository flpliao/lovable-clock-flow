import { RequestStatus } from '@/constants/requestStatus';
import {
  approveLeaveRequest,
  getCompletedLeaveRequests,
  getPendingLeaveRequests,
  rejectLeaveRequest,
} from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveRequestsStore from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types';
import { showError, showSuccess } from '@/utils/toast';
import { useMemo } from 'react';

export const useLeaveRequests = () => {
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

    try {
      const data = await getPendingLeaveRequests();
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedLeaveRequests = async () => {
    const statuses = [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);

    try {
      const data = await getCompletedLeaveRequests();
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 核准請假申請
  const handleLeaveRequestApprove = async (request: LeaveRequest) => {
    try {
      await approveLeaveRequest(request.slug, request.approve_comment);

      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.APPROVED,
      });

      showSuccess('核准成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 拒絕請假申請
  const handleLeaveRequestReject = async (request: LeaveRequest) => {
    try {
      await rejectLeaveRequest(request.slug, request.rejection_reason);

      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.REJECTED,
      });

      showSuccess('拒絕成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
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

export const useLeaveCompletedRequests = () => {
  const { requestsBySlug: requests, getRequestsByStatus } = useLeaveRequestsStore();
  return useMemo(() => {
    return getRequestsByStatus([RequestStatus.APPROVED, RequestStatus.REJECTED]);
  }, [requests]);
};
