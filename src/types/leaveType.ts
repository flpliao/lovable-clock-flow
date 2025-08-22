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
  // UI 擴展欄位（如果 API 沒有提供，可以在前端補充預設值）
  is_active?: boolean;
  is_system_default?: boolean;
}
