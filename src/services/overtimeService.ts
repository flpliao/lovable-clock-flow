
import type { OvertimeRequest, OvertimeFormData, OvertimeType } from '@/types/overtime';
import { overtimeApiService } from './overtime/overtimeApiService';
import { overtimeValidationService } from './overtime/overtimeValidationService';
import { overtimeNotificationService } from './overtime/overtimeNotificationService';

export const overtimeService = {
  // 獲取加班類型
  async getOvertimeTypes(): Promise<OvertimeType[]> {
    return overtimeApiService.getOvertimeTypes();
  },

  // 提交加班申請 - 統一業務邏輯，移除硬編碼邏輯
  async submitOvertimeRequest(formData: OvertimeFormData): Promise<string> {
    // 計算加班時數
    const hours = overtimeValidationService.calculateOvertimeHours(formData.start_time, formData.end_time);

    // 獲取當前登入用戶的實際ID
    const currentUserId = await overtimeValidationService.getCurrentUserId();
    
    const requestData = {
      staff_id: currentUserId,
      user_id: currentUserId,
      overtime_type: formData.overtime_type,
      overtime_date: formData.overtime_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      hours,
      reason: formData.reason,
      status: 'pending' as const, // 讓觸發器決定是否自動核准
      approval_level: 1
    };

    const requestId = await overtimeApiService.createOvertimeRequest(requestData);

    // 發送提交通知
    await overtimeNotificationService.createOvertimeNotification(
      requestId, 
      '加班申請已提交', 
      '您的加班申請已提交，系統將自動分配審核流程'
    );
    
    console.log('✅ 加班申請已提交 - 申請ID:', requestId);

    return requestId;
  },

  // 獲取用戶的加班申請 - 統一查詢介面
  async getUserOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    return overtimeApiService.getUserOvertimeRequests(userId);
  },

  // 獲取待審核的加班申請 - 支援權限檢查
  async getPendingOvertimeRequests(userId?: string): Promise<OvertimeRequest[]> {
    return overtimeApiService.getPendingOvertimeRequests(userId);
  },

  // 審核加班申請 - 統一審核邏輯
  async approveOvertimeRequest(
    requestId: string, 
    action: 'approve' | 'reject', 
    comment?: string,
    approverId?: string
  ): Promise<void> {
    const status = action === 'approve' ? 'approved' : 'rejected';
    
    // 獲取審核人資訊
    let approverInfo;
    if (approverId) {
      approverInfo = await overtimeApiService.getStaffInfo(approverId);
    } else {
      const currentUserId = await overtimeValidationService.getCurrentUserId();
      approverInfo = await overtimeApiService.getStaffInfo(currentUserId);
    }

    await overtimeApiService.updateOvertimeRequestStatus(
      requestId, 
      status, 
      action === 'reject' ? comment : undefined,
      approverInfo ? {
        id: approverInfo.id,
        name: approverInfo.name
      } : undefined,
      comment
    );

    // 發送審核結果通知
    const message = action === 'approve' ? '您的加班申請已通過審核' : '您的加班申請已被拒絕';
    await overtimeNotificationService.createOvertimeNotification(requestId, '加班申請審核結果', message);
    
    console.log(`✅ 加班申請審核完成: ${action} - 申請ID: ${requestId}`);
  },

  // 檢查用戶權限 - 統一權限檢查介面
  async checkUserPermission(userId: string, permission: string): Promise<boolean> {
    return overtimeValidationService.checkUserPermissions(userId, permission);
  },

  // 獲取用戶審核申請 - 新增功能
  async getUserApprovalRequests(userId: string): Promise<OvertimeRequest[]> {
    const requests = await overtimeValidationService.getUserApprovalRequests(userId);
    return requests.map(item => ({
      ...item,
      status: item.status as 'pending' | 'approved' | 'rejected' | 'cancelled'
    }));
  },

  // 創建通知
  async createOvertimeNotification(requestId: string, title: string, message: string): Promise<void> {
    return overtimeNotificationService.createOvertimeNotification(requestId, title, message);
  }
};
