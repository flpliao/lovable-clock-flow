
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';
import { overtimeApiService } from './overtime/overtimeApiService';
import { overtimeValidationService } from './overtime/overtimeValidationService';
import { overtimeNotificationService } from './overtime/overtimeNotificationService';

export const overtimeService = {
  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    return overtimeApiService.getOvertimeTypes();
  },

  // 提交加班申請
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    // 計算加班時數
    const hours = overtimeValidationService.calculateOvertimeHours(formData.start_time, formData.end_time);

    // 獲取當前登入用戶的實際ID
    const currentUserId = await overtimeValidationService.getCurrentUserId();
    
    // 檢查是否可以自動核准
    const canAutoApprove = await overtimeValidationService.checkAutoApprovalEligibility(currentUserId);

    const requestData = {
      staff_id: currentUserId,
      user_id: currentUserId,
      overtime_type: formData.overtime_type,
      overtime_date: formData.overtime_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      hours,
      reason: formData.reason,
      // 只有具備管理權限且有下屬的用戶才能自動核准
      status: canAutoApprove ? 'approved' as const : 'pending' as const,
      approval_level: 1
    };

    const requestId = await overtimeApiService.createOvertimeRequest(requestData);

    // 根據審核結果發送對應通知
    if (canAutoApprove) {
      await overtimeNotificationService.createOvertimeNotification(
        requestId, 
        '加班申請已自動核准', 
        '您的加班申請已自動核准（主管權限）'
      );
      console.log('✅ 主管加班申請已自動核准 - 申請ID:', requestId);
    } else {
      await overtimeNotificationService.createOvertimeNotification(
        requestId, 
        '加班申請已提交', 
        '您的加班申請已提交，等待審核'
      );
      console.log('📋 一般員工加班申請已提交，等待審核 - 申請ID:', requestId);
    }

    return requestId;
  },

  // 獲取用戶的加班申請
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    return overtimeApiService.getUserOvertimeRequests(userId);
  },

  // 獲取待審核的加班申請
  async getPendingOvertimeRequests(): Promise<OvertimeRequest[]> {
    return overtimeApiService.getPendingOvertimeRequests();
  },

  // 審核加班申請
  async approveOvertimeRequest(requestId: string, action: 'approve' | 'reject', comment?: string): Promise<void> {
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    await overtimeApiService.updateOvertimeRequestStatus(
      requestId, 
      status, 
      action === 'reject' ? comment : undefined
    );

    // 創建審核記錄
    await overtimeApiService.createApprovalRecord({
      overtime_request_id: requestId,
      approver_name: '系統管理員', // 提供預設審核人名稱
      level: 1,
      status: action === 'approve' ? 'approved' : 'rejected',
      approval_date: new Date().toISOString(),
      comment
    });

    // 發送通知
    const message = action === 'approve' ? '您的加班申請已通過審核' : '您的加班申請已被拒絕';
    await overtimeNotificationService.createOvertimeNotification(requestId, '加班申請審核結果', message);
  },

  // 創建通知
  async createOvertimeNotification(requestId: string, title: string, message: string): Promise<void> {
    return overtimeNotificationService.createOvertimeNotification(requestId, title, message);
  }
};
