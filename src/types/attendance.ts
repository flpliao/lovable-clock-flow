export interface AttendanceException {
  id: string;
  staff_id: string;
  exception_date: string;
  exception_type:
    | 'missing_check_in'
    | 'missing_check_out'
    | 'late_check_in'
    | 'early_check_out'
    | 'manual_adjustment';
  original_check_in_time?: string;
  original_check_out_time?: string;
  requested_check_in_time?: string;
  requested_check_out_time?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approval_date?: string;
  approval_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface Overtime {
  id: string;
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  compensation_hours?: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approval_date?: string;
  approval_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ReminderSetting {
  id: string;
  staff_id?: string;
  branch_id?: string;
  department?: string;
  reminder_type: 'missing_check_in' | 'missing_check_out' | 'late_arrival' | 'overtime_reminder';
  trigger_condition: Record<string, unknown>;
  reminder_time: string;
  reminder_days: number[];
  notification_method: string[];
  message_template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 出勤記錄介面
export interface AttendanceRecord {
  date: string;
  is_workday: boolean;
  work_schedule: {
    id: number;
    shift: {
      code: string;
      name: string;
      color: string;
    };
    clock_in_time: string;
    clock_out_time: string;
  } | null;
  attendance_status:
    | 'normal'
    | 'late'
    | 'early_leave'
    | 'absent'
    | 'incomplete'
    | 'abnormal'
    | 'off'
    | 'scheduled'
    | 'pending'
    | 'in_progress';
  check_in_records: import('./checkIn').CheckInRecord[];
  check_in_time: string | null;
  check_out_time: string | null;
  is_late: boolean;
  is_early_leave: boolean;
  work_hours: number;
  overtime_hours: number;
}

// 月曆出勤資料回應介面
export interface MonthlyAttendanceResponse {
  year: number;
  month: number;
  attendance_records: Record<string, AttendanceRecord>;
}
