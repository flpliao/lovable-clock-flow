import { RequestStatus } from '@/constants/requestStatus';
import {
  approveMissedCheckInRequest,
  getCompletedMissedCheckInRequests,
  getPendingMissedCheckInRequests,
  rejectMissedCheckInRequest,
} from '@/services/missedCheckInRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import useMissedCheckInRequestsStore from '@/stores/missedCheckInRequestStore';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { showError, showSuccess } from '@/utils/toast';
import { useMemo } from 'react';

export const useMissedCheckInRequests = () => {
  const {
    isLoading,
    updateRequest,
    setLoading,
    addRequests,
    setAllLoaded,
    isAllLoaded,
    addRequestsToMy,
    setMyLoaded,
  } = useMissedCheckInRequestsStore();
  const { employee } = useEmployeeStore();

  const loadPendingMissedCheckInRequests = async () => {
    const statuses = [RequestStatus.PENDING];

    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);
    try {
      const data = await getPendingMissedCheckInRequests();
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

  const loadCompletedMissedCheckInRequests = async () => {
    const statuses = [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);
    try {
      const data = await getCompletedMissedCheckInRequests();
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

  // 核准忘記打卡申請
  const handleMissedCheckInApproval = async (request: MissedCheckInRequest) => {
    try {
      await approveMissedCheckInRequest(request.slug, request.approve_comment);

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

  // 拒絕忘記打卡申請
  const handleMissedCheckInRejection = async (request: MissedCheckInRequest) => {
    try {
      // 更新 store 中的狀態
      await rejectMissedCheckInRequest(request.slug, request.rejection_reason);

      updateRequest(request.slug, {
        status: RequestStatus.REJECTED,
        rejection_reason: request.rejection_reason,
      });

      showSuccess('拒絕成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  return {
    isLoading,
    loadPendingMissedCheckInRequests,
    loadCompletedMissedCheckInRequests,
    handleMissedCheckInApproval,
    handleMissedCheckInRejection,
  };
};

export const useMissedCheckInPendingRequests = () => {
  const { requestsBySlug: requests, getRequestsByStatus } = useMissedCheckInRequestsStore();
  return useMemo(() => {
    return getRequestsByStatus([RequestStatus.PENDING]);
  }, [requests]);
};

export const useMissedCheckInCompletedRequests = () => {
  const { requestsBySlug: requests, getRequestsByStatus } = useMissedCheckInRequestsStore();
  return useMemo(() => {
    return getRequestsByStatus([RequestStatus.REJECTED, RequestStatus.APPROVED]);
  }, [requests]);
};
