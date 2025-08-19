import { RequestStatus } from '@/constants/requestStatus';
import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaveRequests,
  updateLeaveRequest,
} from '@/services/leaveRequestService';
import useLeaveRequestsStore from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types/leaveRequest';

export const useMyLeaveRequest = () => {
  const { requests, addRequest, updateRequest, mergeRequests, isLoading, setLoading } =
    useLeaveRequestsStore();

  // 載入我的請假申請
  const loadMyLeaveRequests = async (employeeSlug: string) => {
    if (requests.filter(r => r.employee?.slug === employeeSlug).length > 0 || isLoading) return;

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
    requests,
    isLoading,

    // 操作方法
    loadMyLeaveRequests,
    handleCreateMyLeaveRequest,
    handleUpdateMyLeaveRequest,
    handleCancelMyLeaveRequest,
  };
};
