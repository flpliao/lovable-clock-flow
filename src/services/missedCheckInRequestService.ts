// missedCheckInRequestService: 提供忘記打卡申請相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { RequestStatus } from '@/constants/requestStatus';
import { apiRoutes } from '@/routes/api';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export class MissedCheckInRequestService {
  // 建立忘記打卡申請
  static async createMissedCheckInRequest(requestData: {
    request_date: string;
    request_type: string;
    check_in_time?: string;
    check_out_time?: string;
    reason: string;
  }): Promise<MissedCheckInRequest> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.missedCheckInRequest.store, requestData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`建立忘記打卡申請失敗: ${message}`);
    }

    return data as MissedCheckInRequest;
  }

  static async getPendingMissedCheckInRequests(): Promise<MissedCheckInRequest[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.pendingApprovals)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入忘記打卡申請列表失敗: ${message}`);
    }

    return data as MissedCheckInRequest[];
  }

  // 獲取已審核的忘記打卡申請
  static async getCompletedMissedCheckInRequests(): Promise<MissedCheckInRequest[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.index)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入忘記打卡申請列表失敗: ${message}`);
    }

    return data as MissedCheckInRequest[];
  }

  static async getMyPendingMissedCheckInRequests(): Promise<MissedCheckInRequest[]> {
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
  }

  // 獲取我的忘記打卡申請
  static async getCompletedMyMissedCheckInRequests(): Promise<MissedCheckInRequest[]> {
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
  }

  // 獲取特定忘記打卡申請
  static async getMissedCheckInRequest(slug: string): Promise<MissedCheckInRequest> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.missedCheckInRequest.show(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入忘記打卡申請失敗: ${message}`);
    }

    return data as MissedCheckInRequest;
  }

  // 更新忘記打卡申請
  static async updateMissedCheckInRequest(
    slug: string,
    requestData: Partial<MissedCheckInRequest>
  ): Promise<MissedCheckInRequest> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.update(slug), requestData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`更新忘記打卡申請失敗: ${message}`);
    }

    return data as MissedCheckInRequest;
  }

  // 刪除忘記打卡申請
  static async deleteMissedCheckInRequest(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.missedCheckInRequest.destroy(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`刪除忘記打卡申請失敗: ${message}`);
    }

    return true;
  }

  // 核准忘記打卡申請
  static async approveMissedCheckInRequest(slug: string, comment: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.approve(slug), {
        comment: comment,
      })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`核准忘記打卡申請失敗: ${message}`);
    }

    return true;
  }

  // 拒絕忘記打卡申請
  static async rejectMissedCheckInRequest(slug: string, rejectionReason: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.missedCheckInRequest.reject(slug), {
        rejection_reason: rejectionReason,
      })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`拒絕忘記打卡申請失敗: ${message}`);
    }

    return true;
  }

  // 取消忘記打卡申請
  static async cancelMissedCheckInRequest(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.missedCheckInRequest.cancel(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`取消忘記打卡申請失敗: ${message}`);
    }

    return true;
  }
}
