import { ApprovalStatus } from '@/constants/approvalStatus';
import { RequestType } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types/checkIn';

export interface MissedCheckInRequest {
  id?: string;
  slug: string;
  company_id?: string;
  employee_id?: string;
  request_date: string;
  request_type: RequestType;
  checked_at: string;
  reason: string;
  status: ApprovalStatus;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  check_in_record?: CheckInRecord;
  created_at: string;
  updated_at: string;
}
