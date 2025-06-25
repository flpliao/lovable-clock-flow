
export interface OvertimeRequest {
  id: string;
  user_id?: string;
  staff_id?: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approval_level?: number;
  current_approver?: string;
  rejection_reason?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  approvals?: OvertimeApproval[];
}

export interface OvertimeApproval {
  id: string;
  overtime_request_id: string;
  approver_id?: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  level: number;
  approval_date?: string;
  comment?: string;
}
