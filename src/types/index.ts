
export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
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
  leave_type: 'annual' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  hours: number;
  reason: string;
}
