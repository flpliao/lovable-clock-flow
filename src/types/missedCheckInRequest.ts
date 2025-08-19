import { RequestType } from '@/constants/checkInTypes';
import { RequestStatus } from '@/constants/requestStatus';
import { CheckInRecord } from '@/types/checkIn';
import { Employee } from './employee';

export interface MissedCheckInRequest {
  id?: string;
  slug: string;
  company_id?: string;
  employee_id?: string;
  employee: Employee;
  request_date: string;
  request_type: RequestType;
  checked_at: string;
  reason: string;
  status: RequestStatus;
  approved_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  check_in_record?: CheckInRecord;
  created_at: string;
  updated_at: string;
}
