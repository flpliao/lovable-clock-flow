// 請假類型介面定義
import { LeaveTypeCode, PaidType } from '@/constants/leave';

export interface LeaveType {
  slug: string;
  name: string;
  code: LeaveTypeCode;
  paid_type: PaidType;
  max_per_year?: number;
  annual_reset?: boolean;
  requires_attachment?: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
  // UI 擴展欄位（如果 API 沒有提供，可以在前端補充預設值）
  is_active?: boolean;
}

// 預設假別類型介面定義（從 API 獲取）
export interface DefaultLeaveType {
  id: number;
  slug: string;
  name: string;
  code: LeaveTypeCode;
  paid_type: PaidType;
  max_per_year?: number;
  description: string;
  annual_reset: boolean;
  requires_attachment: boolean;
  is_active: boolean;
}
