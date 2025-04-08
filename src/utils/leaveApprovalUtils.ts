
import { LeaveRequest, ApprovalRecord } from '@/types';

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

// Calculate approval progress percentage
export const getApprovalProgress = (approvals: ApprovalRecord[]): number => {
  if (!approvals || approvals.length === 0) return 0;
  
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  return (approvedCount / approvals.length) * 100;
};

// Get the status label for an approval
export const getApprovalStatusLabel = (status: string, isCurrentLevel: boolean): string => {
  switch (status) {
    case 'approved': return '已核准';
    case 'rejected': return '已拒絕';
    default: return isCurrentLevel ? '審核中' : '等待中';
  }
};

// Format approver position with level for better understanding
export const formatApproverPosition = (level: number, position: string): string => {
  const levelPrefix = level === 1 ? '一級' : 
                     level === 2 ? '二級' : 
                     level === 3 ? '三級' : '';
  return `${levelPrefix}${position}`;
};
