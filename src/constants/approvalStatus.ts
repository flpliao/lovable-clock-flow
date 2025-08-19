/**
 * 審核狀態常數
 */
export enum ApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * 審核狀態的顯示文字
 */
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.APPROVED]: '已核准',
  [ApprovalStatus.REJECTED]: '已拒絕',
};
