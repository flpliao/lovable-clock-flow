// 請假類型介面定義
import { LeaveTypeCode, PaidType } from '@/constants/leave';

export interface LeaveType {
  slug: string;
  name: string;
  code: LeaveTypeCode;
  paid_type: PaidType;
  max_per_year?: number;
  annual_reset?: boolean;
  required_attachment?: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}
