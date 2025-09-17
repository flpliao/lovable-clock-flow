import { ApprovalStatus } from '@/constants/approvalStatus';
import { Employee } from './employee';

// 審核記錄
export interface ApprovalHistory {
  slug: string;
  application_id?: string;
  approver_id?: string;
  approver?: Employee;
  status: ApprovalStatus;
  level: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}
