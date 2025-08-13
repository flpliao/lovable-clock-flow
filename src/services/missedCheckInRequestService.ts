// missedCheckInRequestService: 提供忘記打卡申請相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { ApprovalStatus } from '@/constants/approvalStatus';
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
}): Promise<MissedCheckInRequest | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.missedCheckInRequest.store, requestData)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as MissedCheckInRequest) : null;
};

// 獲取所有忘記打卡申請
export const getAllMissedCheckInRequests = async (): Promise<MissedCheckInRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.index)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as MissedCheckInRequest[]) : [];
};

// 獲取我的忘記打卡申請
export const getMyMissedCheckInRequests = async (): Promise<MissedCheckInRequest[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.myRequests, {
      params: {
        status: [ApprovalStatus.PENDING, ApprovalStatus.APPROVED],
      },
    })
  );

  return status === ApiResponseStatus.SUCCESS ? (data as MissedCheckInRequest[]) : [];
};

// 獲取特定忘記打卡申請
export const getMissedCheckInRequest = async (
  slug: string
): Promise<MissedCheckInRequest | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.show(slug))
  );

  return status === ApiResponseStatus.SUCCESS ? (data as MissedCheckInRequest) : null;
};

// 更新忘記打卡申請
export const updateMissedCheckInRequest = async (
  slug: string,
  requestData: Partial<MissedCheckInRequest>
): Promise<MissedCheckInRequest | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.update(slug), requestData)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as MissedCheckInRequest) : null;
};

// 刪除忘記打卡申請
export const deleteMissedCheckInRequest = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.missedCheckInRequest.destroy(slug))
  );

  return status === ApiResponseStatus.SUCCESS;
};

// 取消忘記打卡申請
export const cancelMissedCheckInRequest = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.missedCheckInRequest.cancel(slug))
  );

  return status === ApiResponseStatus.SUCCESS;
};
