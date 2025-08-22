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
import { showError } from '@/utils/toast';
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

    try {
      const data = await getMyLeaveRequests();

      addRequests(data);
      addRequestsToMy(data);
      setMyLoaded(statuses);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
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

    try {
      const data = await getMyLeaveRequestsByStatus(statusArray);

      addRequests(data);
      addRequestsToMy(data);
      setMyLoaded(statusArray);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 新增請假申請
  const handleCreateMyLeaveRequest = async (
    requestData: Omit<
      LeaveRequest,
      'id' | 'slug' | 'created_at' | 'updated_at' | 'rejection_reason'
    >
  ): Promise<boolean> => {
    try {
      const newRequest = await createLeaveRequest(requestData);
      addRequest(newRequest);
      addRequestToMy(newRequest);

      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 更新請假申請
  const handleUpdateMyLeaveRequest = async (slug: string, updates: Partial<LeaveRequest>) => {
    try {
      const updatedRequest = await updateLeaveRequest(slug, updates);
      updateRequest(slug, updatedRequest);
    } catch (error) {
      showError(error.message);
    }
  };

  // 取消請假申請
  const handleCancelMyLeaveRequest = async (slug: string): Promise<boolean> => {
    try {
      await cancelLeaveRequest(slug);
      // 更新本地狀態為已取消
      updateRequest(slug, { status: RequestStatus.CANCELLED });
    } catch (error) {
      showError(error.message);
      return false;
    }
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
