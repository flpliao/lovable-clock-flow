// 請假類型代碼常數
export const LEAVE_TYPE_CODES = {
  ANNUAL: 'annual',
  SICK: 'sick',
  PERSONAL: 'personal',
  MARRIAGE: 'marriage',
  BEREAVEMENT: 'bereavement',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  SPECIAL: 'special',
} as const;

// 請假類型代碼類型
export type LeaveTypeCode = (typeof LEAVE_TYPE_CODES)[keyof typeof LEAVE_TYPE_CODES];
