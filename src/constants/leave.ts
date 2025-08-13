/**
 * 請假申請狀態常數
 */
export enum LeaveRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

/**
 * 審核狀態常數
 */
export enum ApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

/**
 * 請假類型代碼常數
 */
export enum LeaveTypeCode {
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  PERSONAL = 'PERSONAL',
  MARRIAGE = 'MARRIAGE',
  BEREAVEMENT = 'BEREAVEMENT',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  SPECIAL = 'SPECIAL',
}

/**
 * 薪資類型常數
 */
export enum PaidType {
  UNPAID = 'unpaid',
  HALF = 'half',
  PAID = 'paid',
}
