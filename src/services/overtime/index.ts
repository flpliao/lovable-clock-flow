
import { overtimeSubmissionService } from './overtimeSubmissionService';
import { queryOvertimeService } from './queryOvertimeService';
import { overtimeApprovalService } from './overtimeApprovalService';

export const overtimeService = {
  // 創建加班申請
  ...overtimeSubmissionService,
  
  // 查詢加班記錄
  ...queryOvertimeService,
  
  // 審核加班申請
  ...overtimeApprovalService
};

// 重新導出類型
export * from './types';
