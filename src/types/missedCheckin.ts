
export interface MissedCheckinApprovalRecord {
  id: string;
  missed_checkin_request_id: string;
  approver_id: string | null;
  approver_name: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  approval_date: string | null;
  comment: string | null;
  created_at: string;
}

export interface MissedCheckinRequest {
  id: string;
  staff_id: string;
  request_date: string;
  missed_type: 'check_in' | 'check_out' | 'both';
  requested_check_in_time?: string;
  requested_check_out_time?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_by_name?: string;
  approval_comment?: string;
  approval_date?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  staff?: {
    name: string;
    department: string;
    position: string;
    branch_name?: string;
  };
  missed_checkin_approval_records?: MissedCheckinApprovalRecord[];
}
