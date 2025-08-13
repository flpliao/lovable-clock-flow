import { ApprovalStatus } from '@/constants/approvalStatus';
import { RequestType } from '@/constants/checkInTypes';

export interface MissedCheckInRequest {
  id?: string;
  slug: string;
  company_id?: string;
  employee_id?: string;
  request_date: string;
  request_type: RequestType;
  check_in_time?: string;
  check_out_time?: string;
  reason: string;
  status: ApprovalStatus;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}
