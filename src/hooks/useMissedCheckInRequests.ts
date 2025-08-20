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
    const data = await getPendingMissedCheckInRequests();
    if (data.length > 0) {
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    }
    setLoading(false);
  };

  const loadCompletedMissedCheckInRequests = async () => {
    const statuses = [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED];
    if (isAllLoaded(statuses) || isLoading) return;
    setLoading(true);
    const data = await getCompletedMissedCheckInRequests();
    if (data.length > 0) {
      addRequests(data);
      setAllLoaded(statuses);

      const myRequests = data.filter(r => r.employee?.slug === employee?.slug);
      addRequestsToMy(myRequests);
      setMyLoaded(statuses);
    }
    setLoading(false);
  };

  // 核准忘記打卡申請
  const handleMissedCheckInApproval = async (request: MissedCheckInRequest) => {
    const success = await approveMissedCheckInRequest(request.slug, request.approve_comment);

    if (success) {
      // 更新 store 中的狀態
      updateRequest(request.slug, {
        status: RequestStatus.APPROVED,
      });
    }

    return success;
  };

  // 拒絕忘記打卡申請
  const handleMissedCheckInRejection = async (request: MissedCheckInRequest) => {
    // 更新 store 中的狀態
    const result = await rejectMissedCheckInRequest(request.slug, request.rejection_reason);
    if (result) {
      updateRequest(request.slug, {
        status: RequestStatus.REJECTED,
        rejection_reason: request.rejection_reason,
      });
    }

    return result;
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
    return getRequestsByStatus(RequestStatus.PENDING);
  }, [requests]);
};
