import { createLeaveRequest, getMyLeaveRequests } from '@/services/leaveRequestService';
import { useMyLeaveRequestsStore } from '@/stores/leaveRequestStore';
import { LeaveRequest } from '@/types';
import { useState } from 'react';

export const useMyLeaveRequest = () => {
  const [loading, setLoading] = useState(false);

  const {
    requests,
    setRequests,
    addRequest,
    updateRequest,
    removeRequest,
    getRequestBySlug,
    getRequestsByStatus,
    getRequestCounts,
    reset,
  } = useMyLeaveRequestsStore();

  // 載入我的請假申請
  const loadMyLeaveRequests = async () => {
    if (requests.length > 0 || loading) return;

    setLoading(true);
    const data = await getMyLeaveRequests();
    setRequests(data);
    setLoading(false);
  };

  // 新增請假申請
  const createMyLeaveRequest = async (
    requestData: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at' | 'rejection_reason'>
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

  // 移除請假申請
  const removeMyLeaveRequest = (id: string) => {
    removeRequest(id);
  };

  // 根據 slug 查詢請假申請
  const getMyLeaveRequestBySlug = (slug: string) => {
    return getRequestBySlug(slug);
  };

  // 根據狀態篩選請假申請
  const getMyLeaveRequestsByStatus = (status: string) => {
    return getRequestsByStatus(status);
  };

  // 獲取統計資料
  const getMyLeaveRequestCounts = () => {
    return getRequestCounts();
  };

  // 重置 store
  const resetMyLeaveRequests = () => {
    reset();
  };

  return {
    // 狀態
    requests,
    loading,

    // 操作方法
    loadMyLeaveRequests,
    createMyLeaveRequest,
    updateMyLeaveRequest,
    removeMyLeaveRequest,

    // 查詢方法
    getMyLeaveRequestBySlug,
    getMyLeaveRequestsByStatus,
    getMyLeaveRequestCounts,

    // 管理方法
    resetMyLeaveRequests,
  };
};
