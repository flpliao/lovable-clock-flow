import { ApiResponseStatus } from '@/constants/api';
import { RequestStatus } from '@/constants/requestStatus';
import { apiRoutes } from '@/routes/api';
import { LeaveRequest } from '@/types';
import { LeaveAvailabilityResponse } from '@/types/leaveBalance';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import dayjs from 'dayjs';

// 獲取待審核的請假申請
export const getPendingLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入待審核的請假申請失敗: ${message}`);
  }

  return data as LeaveRequest[];
};
// 獲取已審核的請假申請
export const getCompletedLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.index)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入已審核的請假申請失敗: ${message}`);
  }

  return data as LeaveRequest[];
};

// 獲取我的請假申請
export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.myRequests)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入我的請假申請失敗: ${message}`);
  }

  const requests = (data as LeaveRequest[]).map(req => ({
    ...req,
    start: dayjs(req.start_date, 'YYYY-MM-DD HH:mm:ss'),
    end: dayjs(req.end_date, 'YYYY-MM-DD HH:mm:ss'),
  }));

  return requests as LeaveRequest[];
};

export const getMyLeaveRequestsByStatus = async (
  statuses: RequestStatus[] | RequestStatus
): Promise<LeaveRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.myRequests, {
      params: { statuses },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入我的請假申請失敗: ${message}`);
  }

  return data as LeaveRequest[];
};

// 獲取待審核的請假申請
export const getPendingApprovals = async (): Promise<LeaveRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入待審核的請假申請失敗: ${message}`);
  }

  return data as LeaveRequest[];
};

// 建立請假申請
export const createLeaveRequest = async (
  leaveRequestData: Omit<
    LeaveRequest,
    'slug' | 'created_at' | 'updated_at' | 'rejection_reason' | 'start' | 'end'
  >
): Promise<LeaveRequest | null> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveRequest.store, leaveRequestData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立請假申請失敗: ${message}`);
  }

  return data as LeaveRequest;
};

// 更新請假申請
export const updateLeaveRequest = async (
  slug: string,
  leaveRequestData: Partial<LeaveRequest>
): Promise<LeaveRequest> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.update(slug), leaveRequestData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`更新請假申請失敗: ${message}`);
  }

  return data as LeaveRequest;
};

// 核准請假申請
export const approveLeaveRequest = async (slug: string, comment: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.approve(slug), {
      comment: comment,
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`核准請假申請失敗: ${message}`);
  }

  return true;
};

// 拒絕請假申請
export const rejectLeaveRequest = async (
  slug: string,
  rejectionReason: string
): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.reject(slug), {
      rejection_reason: rejectionReason,
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`拒絕請假申請失敗: ${message}`);
  }

  return true;
};

// 取消請假申請
export const cancelLeaveRequest = async (slug: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.cancel(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`取消請假申請失敗: ${message}`);
  }

  return true;
};

// 檢查請假申請可用性
export const checkLeaveAvailability = async (params: {
  leave_type_slug?: string;
  start_date?: string;
  end_date?: string;
}): Promise<LeaveAvailabilityResponse> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.checkAvailability(params.leave_type_slug), {
      params,
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`檢查請假可用性失敗: ${message}`);
  }

  return data as LeaveAvailabilityResponse;
};

// 刪除請假申請
export const deleteLeaveRequest = async (slug: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.leaveRequest.destroy(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`刪除請假申請失敗: ${message}`);
  }

  return true;
};

// 下載特殊假別範本
export const downloadSpecialLeaveTemplate = async (): Promise<Blob> => {
  const response = await axiosWithEmployeeAuth().get(
    apiRoutes.leaveRequest.downloadSpecialLeaveTemplate,
    {
      responseType: 'blob',
    }
  );

  return response.data;
};

// 匯入特殊假別
export const importSpecialLeave = async (
  file: File
): Promise<{
  message: string;
  imported_count: number;
  data?: LeaveRequest[];
  summary?: { success_count: number; error_count: number; errors?: string[] };
}> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data, status, message, summary } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveRequest.importSpecialLeave, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`匯入特殊假別失敗: ${message}`);
  }

  return { data, summary } as {
    message: string;
    imported_count: number;
    data?: LeaveRequest[];
    summary?: { success_count: number; error_count: number; errors?: string[] };
  };
};
