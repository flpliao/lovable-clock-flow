
export interface OvertimeRequest {
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  overtime_type: 'weekday' | 'weekend' | 'holiday';
  compensation_type: 'pay' | 'time_off' | 'both';
  reason: string;
  hours: number;
}

export interface OvertimeApprovalRecord {
  id: string;
  overtime_id: string;
  approver_id: string | null;
  approver_name: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  approval_date?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface OvertimeRecord {
  id: string;
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: string;
  compensation_type: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
  approval_level?: number;
  current_approver?: string;
  approver_id?: string;
  approver_name?: string;
  approved_by?: string;
  approved_by_name?: string;
  approval_date?: string;
  approval_comment?: string;
  rejection_reason?: string;
  compensation_hours?: number;
  staff?: {
    name: string;
    department: string;
    position: string;
    supervisor_id?: string;
  };
  overtime_approval_records?: OvertimeApprovalRecord[];
}
