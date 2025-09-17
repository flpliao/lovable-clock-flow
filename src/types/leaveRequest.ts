import { RequestStatus } from '@/constants/requestStatus';
import { ApprovalHistory } from './approvalHistory';
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
  reference_date?: string; // 指定日期：如登記日/死亡日/產檢日/待產日等
  rejection_reason?: string;
  approve_comment?: string;
  approvals?: ApprovalHistory[];
  leave_type?: LeaveType;
  employee?: Employee;
  created_at: string;
  updated_at: string;
}
