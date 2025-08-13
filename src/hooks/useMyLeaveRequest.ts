import { LeaveRequestStatus } from '@/constants/leave';
import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaveRequests,
} from '@/services/leaveRequestService';
import { useMyLeaveRequestsStore } from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types/leaveRequest';
import { useState } from 'react';

export const useMyLeaveRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { requests, setRequests, addRequest, setRequest } = useMyLeaveRequestsStore();

  // 載入我的請假申請
  const loadMyLeaveRequests = async () => {
    if (requests.length > 0 || isLoading) return;

    setIsLoading(true);
    const data = await getMyLeaveRequests();
    setRequests(data);
    setIsLoading(false);
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
    setRequest(slug, updates);
  };

  // 取消請假申請
  const handleCancelMyLeaveRequest = async (slug: string) => {
    const success = await cancelLeaveRequest(slug);
    if (success) {
      // 更新本地狀態為已取消
      setRequest(slug, { status: LeaveRequestStatus.CANCELLED });
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
