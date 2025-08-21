// leaveRequestService: 提供請假申請相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { RequestStatus } from '@/constants/requestStatus';
import { apiRoutes } from '@/routes/api';
import { LeaveRequest } from '@/types';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import dayjs from 'dayjs';

export class LeaveRequestService {
  // 獲取待審核的請假申請
  static async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入待審核的請假申請失敗: ${message}`);
    }

    return data as LeaveRequest[];
  }
  // 獲取已審核的請假申請
  static async getCompletedLeaveRequests(): Promise<LeaveRequest[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.index)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入已審核的請假申請失敗: ${message}`);
    }

    return data as LeaveRequest[];
  }

  // 獲取我的請假申請
  static async getMyLeaveRequests(): Promise<LeaveRequest[]> {
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
  }

  static async getMyLeaveRequestsByStatus(
    statuses: RequestStatus[] | RequestStatus
  ): Promise<LeaveRequest[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.myRequests, {
        params: { statuses },
      })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入我的請假申請失敗: ${message}`);
    }

    return data as LeaveRequest[];
  }

  // 獲取待審核的請假申請
  static async getPendingApprovals(): Promise<LeaveRequest[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.leaveRequest.pendingApprovals)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入待審核的請假申請失敗: ${message}`);
    }

    return data as LeaveRequest[];
  }

  // 建立請假申請
  static async createLeaveRequest(
    leaveRequestData: Omit<
      LeaveRequest,
      'slug' | 'created_at' | 'updated_at' | 'rejection_reason' | 'start' | 'end'
    >
  ): Promise<LeaveRequest | null> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.leaveRequest.store, leaveRequestData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`建立請假申請失敗: ${message}`);
    }

    return data as LeaveRequest;
  }

  // 更新請假申請
  static async updateLeaveRequest(
    slug: string,
    leaveRequestData: Partial<LeaveRequest>
  ): Promise<LeaveRequest> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.update(slug), leaveRequestData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`更新請假申請失敗: ${message}`);
    }

    return data as LeaveRequest;
  }

  // 核准請假申請
  static async approveLeaveRequest(slug: string, comment: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.approve(slug), {
        comment: comment,
      })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`核准請假申請失敗: ${message}`);
    }

    return true;
  }

  // 拒絕請假申請
  static async rejectLeaveRequest(slug: string, rejectionReason: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.reject(slug), {
        rejection_reason: rejectionReason,
      })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`拒絕請假申請失敗: ${message}`);
    }

    return true;
  }

  // 取消請假申請
  static async cancelLeaveRequest(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.leaveRequest.cancel(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`取消請假申請失敗: ${message}`);
    }

    return true;
  }

  // 刪除請假申請
  static async deleteLeaveRequest(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.leaveRequest.destroy(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`刪除請假申請失敗: ${message}`);
    }

    return true;
  }
}
