import { ApprovalStatus } from '@/constants/approvalStatus';
import { RequestStatus } from '@/constants/requestStatus';
import { Employee } from './employee';
import { LeaveType } from './leaveType';

// 請假申請記錄
export interface LeaveRequest {
  slug: string;
  employee_id?: string; // 可選，創建時後端會自動從認證信息中獲取
  start_date: string;
  end_date: string;
  leave_type_id?: string;
  leave_type_code: string;
  status: RequestStatus;
  duration_hours: number;
  reason: string;
  rejection_reason?: string;
  leave_type?: LeaveType;
  employee?: Employee;
  created_at: string;
  updated_at: string;
}

// 審核記錄
export interface ApprovalRecord {
  slug: string;
  leave_request_id: string;
  approver_id: string;
  approver_name: string;
  status: ApprovalStatus;
  level: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}
