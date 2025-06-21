
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
  approval_comment?: string;
  approval_date?: string;
  created_at: string;
  updated_at: string;
  staff?: {
    name: string;
    department: string;
    position: string;
  };
}
