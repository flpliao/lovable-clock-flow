// leaveRequestService: 提供請假申請相關 API 操作
import { apiRoutes } from '@/routes/api';
import { LeaveRequest } from '@/types';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 獲取所有請假申請
export const getAllLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.index)
  );

  if (status === 'error') {
    return [];
  }

  return data as LeaveRequest[];
};

// 獲取我的請假申請
export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.myRequests)
  );

  if (status === 'error') {
    return [];
  }

  return data as LeaveRequest[];
};

// 獲取待審核的請假申請
export const getPendingApprovals = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
  );

  if (status === 'error') {
    return [];
  }

  return data as LeaveRequest[];
};

// 建立請假申請
export const createLeaveRequest = async (
  leaveRequestData: Omit<LeaveRequest, 'slug' | 'created_at' | 'updated_at' | 'rejection_reason'>
): Promise<LeaveRequest> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveRequest.store, leaveRequestData)
  );

  if (status === 'error') {
    return null;
  }

  return data as LeaveRequest;
};

// 更新請假申請
export const updateLeaveRequest = async (
  id: string,
  leaveRequestData: Partial<LeaveRequest>
): Promise<LeaveRequest> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.update(id), leaveRequestData)
  );

  if (status === 'error') {
    return null;
  }

  return data as LeaveRequest;
};

// 取消請假申請
export const cancelLeaveRequest = async (id: string): Promise<string> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveRequest.cancel(id))
  );

  return status;
};

// 刪除請假申請
export const deleteLeaveRequest = async (id: string): Promise<string> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.leaveRequest.destroy(id))
  );

  return status;
};
