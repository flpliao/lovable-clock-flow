import { apiRoutes } from '@/routes';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export interface MissedCheckinRequest {
  id?: number;
  company_id?: number;
  employee_id?: number;
  request_date: string;
  request_type: 'check_in' | 'check_out';
  checked_at: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  employee?: {
    id: number;
    name: string;
    employee_id: string;
  };
  checkInRecord?: {
    id: number;
    type: string;
    checked_at: string;
    status: string;
    approval_status: string;
  };
}

export interface MissedCheckinFormData {
  request_date: string;
  request_type: 'check_in' | 'check_out';
  checked_at: string;
  reason: string;
}

/**
 * 提交忘打卡申請
 */
export const submitMissedCheckinRequest = async (
  formData: MissedCheckinFormData
): Promise<MissedCheckinRequest> => {
  const { data } = await axiosWithEmployeeAuth().post(
    apiRoutes.missedCheckInRequest.store,
    formData
  );
  return data.data;
};

/**
 * 取得員工的忘打卡申請記錄
 */
export const fetchMissedCheckinRequests = async (): Promise<MissedCheckinRequest[]> => {
  const { data } = await axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.myRequests);
  return data.data.data || [];
};

/**
 * 檢查是否有重複的忘打卡申請
 * 通過獲取員工的申請記錄來檢查重複
 */
export const checkDuplicateRequest = async (
  requestDate: string,
  requestType: 'check_in' | 'check_out'
): Promise<{ canSubmit: boolean; errorMessage?: string }> => {
  try {
    const { data } = await axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.myRequests, {
      params: {
        status: 'pending',
        request_type: requestType,
        date_from: requestDate,
        date_to: requestDate,
      },
    });

    const existingRequests = data.data?.data || [];
    const hasDuplicate = existingRequests.some(
      (request: MissedCheckinRequest) =>
        request.request_date === requestDate && request.request_type === requestType
    );

    return {
      canSubmit: !hasDuplicate,
      errorMessage: hasDuplicate ? '該日期已有相同類型的待審核申請' : undefined,
    };
  } catch (error: unknown) {
    console.error('檢查重複申請失敗:', error);
    return {
      canSubmit: false,
      errorMessage:
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '檢查重複申請時發生錯誤',
    };
  }
};

/**
 * 取消忘打卡申請
 */
export const cancelMissedCheckinRequest = async (requestId: number): Promise<void> => {
  await axiosWithEmployeeAuth().delete(apiRoutes.missedCheckInRequest.cancel(requestId.toString()));
};
