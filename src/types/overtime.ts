
export interface OvertimeRequest {
  id: string;
  staff_id?: string;
  user_id?: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  current_approver?: string;
  approval_level?: number;
  rejection_reason?: string;
  attachment_url?: string;
  created_at: string;
  updated_at: string;
  approvals?: OvertimeApprovalRecord[];
  applicant_name?: string;
}

export interface OvertimeApprovalRecord {
  id: string;
  overtime_request_id: string;
  approver_id?: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  level: number;
  approval_date?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface OvertimeRequestFormData {
  overtime_date: Date;
  start_time: string;
  end_time: string;
  reason: string;
  attachment?: File;
}
