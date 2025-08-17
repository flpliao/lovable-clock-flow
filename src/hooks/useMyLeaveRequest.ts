import { LeaveRequestStatus } from '@/constants/leave';
import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaveRequests,
} from '@/services/leaveRequestService';
import useLeaveRequestsStore from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types/leaveRequest';

export const useMyLeaveRequest = () => {
  const {
    requests,
    getMyRequests,
    getMyRequestsByStatus,
    addRequest,
    updateRequest,
    mergeRequests,
    isLoading,
    setLoading,
  } = useLeaveRequestsStore();

  // 載入我的請假申請
  const loadMyLeaveRequests = async (employeeSlug: string) => {
    if (getMyRequests(employeeSlug).length > 0 || isLoading) return;

    setLoading(true);
    const data = await getMyLeaveRequests();
    mergeRequests(data);
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
    }
    return newRequest;
  };

  // 更新請假申請
  const handleUpdateMyLeaveRequest = (slug: string, updates: Partial<LeaveRequest>) => {
    updateRequest(slug, updates);
  };

  // 取消請假申請
  const handleCancelMyLeaveRequest = async (slug: string) => {
    const success = await cancelLeaveRequest(slug);
    if (success) {
      // 更新本地狀態為已取消
      updateRequest(slug, { status: LeaveRequestStatus.CANCELLED });
    }

    return success;
  };

  return {
    // 狀態
    requests,
    isLoading,

    // 操作方法
    loadMyLeaveRequests,
    getMyRequestsByStatus,
    handleCreateMyLeaveRequest,
    handleUpdateMyLeaveRequest,
    handleCancelMyLeaveRequest,
  };
};
