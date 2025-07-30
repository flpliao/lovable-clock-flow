import {
  cancelLeaveRequest,
  createLeaveRequest,
  getMyLeaveRequests,
} from '@/services/leaveRequestService';
import { useMyLeaveRequestsStore } from '@/stores/leaveRequestStore';
import { LeaveRequest, LeaveRequestStatus } from '@/types/leaveRequest';
import { useState } from 'react';

export const useMyLeaveRequest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { requests, setRequests, addRequest, updateRequest, removeRequest, reset } =
    useMyLeaveRequestsStore();

  // 載入我的請假申請
  const loadMyLeaveRequests = async () => {
    if (requests.length > 0 || isLoading) return;

    setIsLoading(true);
    const data = await getMyLeaveRequests();
    setRequests(data);
    setIsLoading(false);
  };

  // 新增請假申請
  const createMyLeaveRequest = async (
    requestData: Omit<LeaveRequest, 'slug' | 'created_at' | 'updated_at' | 'rejection_reason'>
  ) => {
    const newRequest = await createLeaveRequest(requestData);
    if (newRequest) {
      addRequest(newRequest);
    }
    return newRequest;
  };

  // 更新請假申請
  const updateMyLeaveRequest = (id: string, updates: Partial<LeaveRequest>) => {
    updateRequest(id, updates);
  };

  // 取消請假申請
  const cancelMyLeaveRequest = async (slug: string) => {
    try {
      const result = await cancelLeaveRequest(slug);
      if (result === 'success') {
        // 更新本地狀態為已取消
        updateRequest(slug, { status: LeaveRequestStatus.CANCELLED });
        return true;
      }
      return false;
    } catch (error) {
      console.error('取消請假申請失敗:', error);
      return false;
    }
  };

  // 移除請假申請
  const removeMyLeaveRequest = (id: string) => {
    removeRequest(id);
  };

  // 重置 store
  const resetMyLeaveRequests = () => {
    reset();
  };

  return {
    // 狀態
    requests,
    isLoading,

    // 操作方法
    loadMyLeaveRequests,
    createMyLeaveRequest,
    updateMyLeaveRequest,
    cancelMyLeaveRequest,
    removeMyLeaveRequest,

    // 管理方法
    resetMyLeaveRequests,
  };
};
