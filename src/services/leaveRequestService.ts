// leaveRequestService: 提供請假申請相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { RequestStatus } from '@/constants/requestStatus';
import { apiRoutes } from '@/routes/api';
import { LeaveRequest } from '@/types';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import dayjs from 'dayjs';

// 獲取待審核的請假申請
export const getPendingLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as LeaveRequest[]) : [];
};
// 獲取已審核的請假申請
export const getCompletedLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.index)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as LeaveRequest[]) : [];
};

// 獲取我的請假申請
export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.myRequests)
  );

  const requests = (data as LeaveRequest[]).map(req => ({
    ...req,
    start: dayjs(req.start_date, 'YYYY-MM-DD HH:mm:ss'),
    end: dayjs(req.end_date, 'YYYY-MM-DD HH:mm:ss'),
  }));

  return status === ApiResponseStatus.SUCCESS ? (requests as LeaveRequest[]) : [];
};

export const getMyLeaveRequestsByStatus = async (
  statuses: RequestStatus[] | RequestStatus
): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.myRequests, {
      params: { statuses },
    })
  );

  return status === ApiResponseStatus.SUCCESS ? (data as LeaveRequest[]) : [];
};

// 獲取待審核的請假申請
export const getPendingApprovals = async (): Promise<LeaveRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as LeaveRequest[]) : [];
};

// 建立請假申請
export const createLeaveRequest = async (
  leaveRequestData: Omit<
    LeaveRequest,
    'slug' | 'created_at' | 'updated_at' | 'rejection_reason' | 'start' | 'end'
  >
): Promise<LeaveRequest | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveRequest.store, leaveRequestData)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as LeaveRequest) : null;
};

// 更新請假申請
export const updateLeaveRequest = async (
  slug: string,
  leaveRequestData: Partial<LeaveRequest>
): Promise<LeaveRequest> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.update(slug), leaveRequestData)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as LeaveRequest) : null;
};

// 核准請假申請
export const approveLeaveRequest = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.approve(slug))
  );

  return status === ApiResponseStatus.SUCCESS;
};

// 拒絕請假申請
export const rejectLeaveRequest = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.reject(slug))
  );

  return status === ApiResponseStatus.SUCCESS;
};

// 取消請假申請
export const cancelLeaveRequest = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.cancel(slug))
  );

  return status === ApiResponseStatus.SUCCESS;
};

// 刪除請假申請
export const deleteLeaveRequest = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.leaveRequest.destroy(slug))
  );

  return status === ApiResponseStatus.SUCCESS;
};
