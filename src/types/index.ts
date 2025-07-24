// 重新導出 API 相關類型
export type { ApiResponse, CallApiOptions, DecodedResponse, DecodeOptions } from '@/types/api';

// 重新導出考勤相關類型
export type { AttendanceException, Overtime, ReminderSetting } from '@/types/attendance';

// 重新導出打卡相關類型
export type { CheckInPoint, CheckInRecord } from '@/types/checkIn';

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

export interface LeaveRequest {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  leave_type:
    | 'annual'
    | 'sick'
    | 'personal'
    | 'marriage'
    | 'bereavement'
    | 'maternity'
    | 'paternity'
    | 'parental'
    | 'occupational'
    | 'menstrual'
    | 'other';
  status: 'pending' | 'approved' | 'rejected';
  hours: number;
  reason: string;
  attachment_url?: string;
  approvals?: ApprovalRecord[];
  current_approver?: string;
  approval_level?: number;
  rejection_reason?: string;
  approved_by?: string; // 新增核准人欄位
  approved_at?: string; // 新增核准時間欄位
  created_at?: string;
  updated_at?: string;
}

export interface ApprovalRecord {
  id: string;
  leave_request_id: string;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  approval_date?: string;
  level: number;
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
