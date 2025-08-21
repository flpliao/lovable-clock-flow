import { LeaveRequest } from '@/types';

export interface LeaveRequestWithApplicant extends LeaveRequest {
  applicant_name?: string;
  approvals?: unknown[];
}
