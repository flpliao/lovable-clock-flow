// 請假申請記錄
export interface LeaveRequest {
  id: string;
  employee_id: string;
  approver_id?: string;
  start_date: string;
  end_date: string;
  leave_type_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  duration_hours: number;
  reason: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// 審核記錄
export interface ApprovalRecord {
  id: string;
  leave_request_id: string;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  level: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}
