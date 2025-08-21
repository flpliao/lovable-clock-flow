/**
 * 審核狀態常數
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * 審核狀態的顯示文字
 */
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: '等待審核',
  [ApprovalStatus.APPROVED]: '已核准',
  [ApprovalStatus.REJECTED]: '已拒絕',
};
