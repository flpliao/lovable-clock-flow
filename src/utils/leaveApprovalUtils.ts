
import { LeaveRequest } from '@/types';

// Helper to get the latest approval status
export const getApprovalStatus = (leave: LeaveRequest): string => {
  if (leave.status === 'rejected') {
    return `被 ${leave.approvals?.find(a => a.status === 'rejected')?.approver_name || '主管'} 拒絕`;
  } else if (leave.status === 'approved') {
    return '全部審核完成';
  } else {
    // Find the current approver
    const currentApproval = leave.approvals?.find(a => a.level === leave.approval_level);
    return `等待 ${currentApproval?.approver_name || '主管'} 審核`;
  }
};
