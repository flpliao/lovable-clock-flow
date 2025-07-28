import { apiRoutes } from '@/routes/api';
import { LeaveRequest } from '@/types';
import {
  LeaveBalance,
  LeaveFormData,
  LeaveStatusLabel,
  LeaveTypeOption,
  LeaveValidationResult,
} from '@/types/leave';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { differenceInDays, format } from 'date-fns';

// 請假服務類
export class leaveRequestService {
  // 提交請假申請 (Create)
  static async submitLeaveRequest(formData: LeaveFormData): Promise<LeaveRequest> {
    try {
      // 計算請假時數
      const hours = this.calculateLeaveHours(formData.start_date, formData.end_date);

      // 準備請求資料
      const requestData = {
        start_date: format(formData.start_date, 'yyyy-MM-dd'),
        end_date: format(formData.end_date, 'yyyy-MM-dd'),
        leave_type: formData.leave_type,
        reason: formData.reason,
        hours: hours,
      };

      // 使用 STORE API
      const response = await axiosWithEmployeeAuth().post(apiRoutes.leave.store, requestData);

      return response.data;
    } catch (error) {
      console.error('提交請假申請失敗:', error);
      throw new Error(error instanceof Error ? error.message : '請假申請提交失敗');
    }
  }

  // 獲取所有請假申請 (Read)
  static async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await axiosWithEmployeeAuth().get(apiRoutes.leave.index);

      return response.data;
    } catch (error) {
      console.error('獲取請假申請列表失敗:', error);
      throw new Error(error instanceof Error ? error.message : '獲取請假申請列表失敗');
    }
  }

  // 獲取我的請假申請 (Read)
  static async getMyLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await axiosWithEmployeeAuth().get(apiRoutes.leave.myRequests);

      return response.data;
    } catch (error) {
      console.error('獲取我的請假申請失敗:', error);
      throw new Error(error instanceof Error ? error.message : '獲取我的請假申請失敗');
    }
  }

  // 獲取待審核的請假申請 (Read)
  static async getPendingApprovals(): Promise<LeaveRequest[]> {
    try {
      const response = await axiosWithEmployeeAuth().get(apiRoutes.leave.pendingApprovals);

      return response.data;
    } catch (error) {
      console.error('獲取待審核請假申請失敗:', error);
      throw new Error(error instanceof Error ? error.message : '獲取待審核請假申請失敗');
    }
  }

  // 獲取請假申請詳情 (Read)
  static async getLeaveRequestDetail(requestId: string): Promise<LeaveRequest> {
    try {
      const response = await axiosWithEmployeeAuth().get(apiRoutes.leave.show(requestId));

      return response.data;
    } catch (error) {
      console.error('獲取請假申請詳情失敗:', error);
      throw new Error(error instanceof Error ? error.message : '獲取請假申請詳情失敗');
    }
  }

  // 更新請假申請 (Update)
  static async updateLeaveRequest(
    requestId: string,
    action: 'approve' | 'reject',
    comment?: string
  ): Promise<void> {
    try {
      const requestData = {
        action,
        comment,
      };

      await axiosWithEmployeeAuth().post(apiRoutes.leave.update(requestId), requestData);
    } catch (error) {
      console.error('更新請假申請失敗:', error);
      throw new Error(error instanceof Error ? error.message : '更新請假申請失敗');
    }
  }

  // 取消請假申請
  static async cancelLeaveRequest(requestId: string): Promise<void> {
    try {
      await axiosWithEmployeeAuth().post(apiRoutes.leave.cancel(requestId));
    } catch (error) {
      console.error('取消請假申請失敗:', error);
      throw new Error(error instanceof Error ? error.message : '取消請假申請失敗');
    }
  }

  // 刪除請假申請 (Delete)
  static async deleteLeaveRequest(requestId: string): Promise<void> {
    try {
      await axiosWithEmployeeAuth().delete(apiRoutes.leave.destroy(requestId));
    } catch (error) {
      console.error('刪除請假申請失敗:', error);
      throw new Error(error instanceof Error ? error.message : '刪除請假申請失敗');
    }
  }

  // 獲取請假餘額 (Read)
  static async getLeaveBalance(year?: number): Promise<LeaveBalance> {
    try {
      const currentYear = year || new Date().getFullYear();

      const response = await axiosWithEmployeeAuth().get(apiRoutes.leave.balance, {
        params: { year: currentYear },
      });

      return response.data;
    } catch (error) {
      console.error('獲取請假餘額失敗:', error);
      throw new Error(error instanceof Error ? error.message : '獲取請假餘額失敗');
    }
  }

  // 計算請假時數（工作日，每天8小時）
  static calculateLeaveHours(startDate: Date, endDate: Date): number {
    const days = differenceInDays(endDate, startDate) + 1;
    return days * 8; // 每天8小時
  }

  // 驗證請假申請資料
  static validateLeaveRequest(formData: LeaveFormData): LeaveValidationResult {
    const errors: string[] = [];

    // 檢查日期
    if (formData.start_date > formData.end_date) {
      errors.push('開始日期不能晚於結束日期');
    }

    if (formData.start_date < new Date()) {
      errors.push('開始日期不能早於今天');
    }

    // 檢查請假類型
    if (!formData.leave_type) {
      errors.push('請選擇請假類型');
    }

    // 檢查原因
    if (!formData.reason || formData.reason.trim().length < 5) {
      errors.push('請假原因至少需要5個字符');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 獲取請假類型選項
  static getLeaveTypeOptions(): LeaveTypeOption[] {
    return [
      { value: 'annual', label: '年假' },
      { value: 'sick', label: '病假' },
      { value: 'personal', label: '事假' },
      { value: 'other', label: '其他' },
    ];
  }

  // 獲取請假狀態標籤
  static getStatusLabel(status: string): LeaveStatusLabel {
    const statusMap = {
      pending: { label: '待審核', color: 'text-yellow-600' },
      approved: { label: '已核准', color: 'text-green-600' },
      rejected: { label: '已拒絕', color: 'text-red-600' },
      cancelled: { label: '已取消', color: 'text-gray-600' },
    };

    return statusMap[status as keyof typeof statusMap] || { label: '未知', color: 'text-gray-600' };
  }
}
