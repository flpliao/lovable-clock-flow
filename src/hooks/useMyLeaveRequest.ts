import { RequestStatus } from '@/constants/requestStatus';
import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaveRequests,
  getMyLeaveRequestsByStatus,
  updateLeaveRequest,
} from '@/services/leaveRequestService';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveRequestsStore from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types/leaveRequest';
import { useMemo } from 'react';

export const useMyLeaveRequest = () => {
  const {
    requestsBySlug,
    addRequest,
    addRequestToMy,
    updateRequest,
    isLoading,
    isMyLoaded,
    addRequestsToMy,
    addRequests,
    setMyLoaded,
    setLoading,
  } = useLeaveRequestsStore();

  // 載入我的請假申請
  const loadMyLeaveRequests = async () => {
    const statuses = Object.values(RequestStatus);
    if (isMyLoaded(statuses) || isLoading) return;

    setLoading(true);
    const data = await getMyLeaveRequests();
    if (data.length > 0) {
      addRequests(data);
      addRequestsToMy(data);
      setMyLoaded(statuses);
    }
    setLoading(false);
  };

  const loadMyPendingRequests = async () => {
    const statuses = [RequestStatus.PENDING];
    return loadMyRequestsByStatus(statuses);
  };

  const loadMyCompletedRequests = async () => {
    const statuses = [RequestStatus.CANCELLED, RequestStatus.REJECTED, RequestStatus.APPROVED];
    return loadMyRequestsByStatus(statuses);
  };

  const loadMyRequestsByStatus = async (statuses: RequestStatus[] | RequestStatus) => {
    const statusArray = Array.isArray(statuses) ? statuses : [statuses];
    if (isMyLoaded(statusArray) || isLoading) return;
    setLoading(true);
    const data = await getMyLeaveRequestsByStatus(statusArray);
    if (data.length > 0) {
      addRequests(data);
      addRequestsToMy(data);
      setMyLoaded(statusArray);
    }
    setLoading(false);
  };

  // 新增請假申請
  const handleCreateMyLeaveRequest = async (
    requestData: Omit<
      LeaveRequest,
      'id' | 'slug' | 'created_at' | 'updated_at' | 'rejection_reason'
    >
  ): Promise<LeaveRequest | null> => {
    const newRequest = await createLeaveRequest(requestData);
    if (newRequest) {
      addRequest(newRequest);
      addRequestToMy(newRequest);
    }
    return newRequest;
  };

  // 更新請假申請
  const handleUpdateMyLeaveRequest = async (slug: string, updates: Partial<LeaveRequest>) => {
    const updatedRequest = await updateLeaveRequest(slug, updates);
    if (updatedRequest) {
      updateRequest(slug, updatedRequest);
    }
    return updatedRequest;
  };

  // 取消請假申請
  const handleCancelMyLeaveRequest = async (slug: string) => {
    const success = await cancelLeaveRequest(slug);
    if (success) {
      // 更新本地狀態為已取消
      updateRequest(slug, { status: RequestStatus.CANCELLED });
    }

    return success;
  };

  return {
    // 狀態
    requests: requestsBySlug,
    isLoading,

    // 操作方法
    loadMyLeaveRequests,
    loadMyRequestsByStatus,
    loadMyPendingRequests,
    loadMyCompletedRequests,
    handleCreateMyLeaveRequest,
    handleUpdateMyLeaveRequest,
    handleCancelMyLeaveRequest,
  };
};

export const useMyLeaveRequestByStatus = (statuses: RequestStatus[] | RequestStatus) => {
  const { requestsBySlug: requests, getRequestsByStatus } = useLeaveRequestsStore();
  const { employee } = useEmployeeStore();
  const statusArray = Array.isArray(statuses) ? statuses : [statuses];
  return useMemo(() => {
    return getRequestsByStatus(statusArray, true).filter(r => r.employee?.slug === employee.slug);
  }, [requests, employee.slug, statusArray]);
};
