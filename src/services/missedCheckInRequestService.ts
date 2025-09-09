import { ApiResponseStatus } from '@/constants/api';
import { RequestStatus } from '@/constants/requestStatus';
import { apiRoutes } from '@/routes/api';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 建立忘記打卡申請
export const createMissedCheckInRequest = async (requestData: {
  request_date: string;
  request_type: string;
  check_in_time?: string;
  check_out_time?: string;
  reason: string;
}): Promise<MissedCheckInRequest> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.missedCheckInRequest.store, requestData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立忘記打卡申請失敗: ${message}`);
  }

  return data as MissedCheckInRequest;
};

export const getPendingMissedCheckInRequests = async (): Promise<MissedCheckInRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.pendingApprovals)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入忘記打卡申請列表失敗: ${message}`);
  }

  return data as MissedCheckInRequest[];
};

// 獲取已審核的忘記打卡申請
export const getCompletedMissedCheckInRequests = async (): Promise<MissedCheckInRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.index)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入忘記打卡申請列表失敗: ${message}`);
  }

  return data as MissedCheckInRequest[];
};

export const getMyPendingMissedCheckInRequests = async (): Promise<MissedCheckInRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.myRequests, {
      params: {
        statuses: [RequestStatus.PENDING],
      },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入忘記打卡申請列表失敗: ${message}`);
  }

  return data as MissedCheckInRequest[];
};

// 獲取我的忘記打卡申請
export const getCompletedMyMissedCheckInRequests = async (): Promise<MissedCheckInRequest[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.myRequests, {
      params: {
        statuses: [RequestStatus.APPROVED, RequestStatus.REJECTED, RequestStatus.CANCELLED],
      },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入忘記打卡申請列表失敗: ${message}`);
  }

  return data as MissedCheckInRequest[];
};

// 獲取特定忘記打卡申請
export const getMissedCheckInRequest = async (slug: string): Promise<MissedCheckInRequest> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.show(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入忘記打卡申請失敗: ${message}`);
  }

  return data as MissedCheckInRequest;
};

// 更新忘記打卡申請
export const updateMissedCheckInRequest = async (
  slug: string,
  requestData: Partial<MissedCheckInRequest>
): Promise<MissedCheckInRequest> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.update(slug), requestData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`更新忘記打卡申請失敗: ${message}`);
  }

  return data as MissedCheckInRequest;
};

// 刪除忘記打卡申請
export const deleteMissedCheckInRequest = async (slug: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.missedCheckInRequest.destroy(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`刪除忘記打卡申請失敗: ${message}`);
  }

  return true;
};

// 核准忘記打卡申請
export const approveMissedCheckInRequest = async (
  slug: string,
  comment: string
): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.approve(slug), {
      comment: comment,
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`核准忘記打卡申請失敗: ${message}`);
  }

  return true;
};

// 拒絕忘記打卡申請
export const rejectMissedCheckInRequest = async (
  slug: string,
  rejectionReason: string
): Promise<MissedCheckInRequest> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.reject(slug), {
      rejection_reason: rejectionReason,
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`拒絕忘記打卡申請失敗: ${message}`);
  }

  return data as MissedCheckInRequest;
};

// 取消忘記打卡申請
export const cancelMissedCheckInRequest = async (slug: string): Promise<MissedCheckInRequest> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.missedCheckInRequest.cancel(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`取消忘記打卡申請失敗: ${message}`);
  }

  return data as MissedCheckInRequest;
};
