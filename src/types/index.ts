
export interface User {
  id: string;
  name: string;
  position: string;
  department: string;
  onboard_date: string;
  role?: 'user' | 'admin';
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
  approvals?: ApprovalRecord[];
  current_approver?: string;
  approval_level?: number;
  rejection_reason?: string;
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

// Check-in record type
export interface CheckInRecord {
  id: string;
  userId: string;
  timestamp: string;
  type: 'location' | 'ip';
  status: 'success' | 'failed';
  action: 'check-in' | 'check-out';  // Field to track check-in or check-out
  details: {
    latitude?: number;
    longitude?: number;
    distance?: number;
    ip?: string;
    locationName?: string;
  };
}
