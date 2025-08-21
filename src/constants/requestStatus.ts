/**
 * 申請狀態常數
 */
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

/**
 * 審核狀態的顯示文字
 */
export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.PENDING]: '等待審核',
  [RequestStatus.APPROVED]: '已核准',
  [RequestStatus.REJECTED]: '已拒絕',
  [RequestStatus.CANCELLED]: '已取消',
};
