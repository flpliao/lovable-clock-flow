
import { overtimeSubmissionService } from './overtimeSubmissionService';
import { queryOvertimeService } from './queryOvertimeService';
import { overtimeApprovalService } from './overtimeApprovalService';

export const overtimeService = {
  // 加班申請相關
  ...overtimeSubmissionService,
  
  // 查詢加班記錄
  ...queryOvertimeService,
  
  // 審核加班申請
  ...overtimeApprovalService
};

// 重新導出類型和權限
export * from './types';
export { OVERTIME_PERMISSIONS } from '@/components/staff/constants/permissions/overtimePermissions';
