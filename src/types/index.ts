// 重新導出 API 相關類型
export type { ApiResponse, CallApiOptions, DecodedResponse, DecodeOptions } from '@/types/api';

// 重新導出考勤相關類型
export type { AttendanceException, Overtime, ReminderSetting } from '@/types/attendance';

// 重新導出打卡相關類型
export type { CheckInPoint, CheckInRecord } from '@/types/checkIn';

// 重新導出請假申請相關類型
export type { ApprovalRecord, LeaveRequest } from '@/types/leaveRequest';

// 重新導出按鈕相關類型
export type {
  AddButtonProps,
  BaseButtonProps,
  ClickableButtonProps,
  ClickableLoadingButtonProps,
  SubmitButtonProps,
} from '@/types/button';

export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
  hire_date?: string;
  supervisor_id?: string;
  role_id: string;
  gender?: 'male' | 'female';
  email?: string;
  years_of_service?: number;
  annual_leave_entitlement?: number;
}

export interface AnnualLeaveBalance {
  id: string;
  user_id: string;
  year: number;
  total_days: number;
  used_days: number;
}

export interface Attendance {
  id: string;
  user_id: string;
  check_in_time: string;
  check_out_time?: string;
  latitude: number;
  longitude: number;
  status: 'normal' | 'abnormal';
}

export interface Shift {
  id: string;
  user_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
}

export interface Approver {
  id: string;
  name: string;
  position: string;
  level: number;
}
