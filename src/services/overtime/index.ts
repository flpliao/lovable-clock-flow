
import { createOvertimeService } from './createOvertimeService';
import { queryOvertimeService } from './queryOvertimeService';
import { approvalOvertimeService } from './approvalOvertimeService';

export const overtimeService = {
  // 創建加班申請
  ...createOvertimeService,
  
  // 查詢加班記錄
  ...queryOvertimeService,
  
  // 審核加班申請
  ...approvalOvertimeService
};

// 重新導出類型
export * from './types';
