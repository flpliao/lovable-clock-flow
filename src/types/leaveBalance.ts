import { LeaveType } from './leaveType';

// 假別餘額 API 回傳資料
export interface LeaveBalanceResponse {
  leave_type: LeaveType;
  remaining_hours: number;
  used_hours: number;
  max_hours_per_year: number;
  max_days_per_year: number;
  year: number;
  suggestion: string | null;
  seniority_years: number;
}

// 請假可用性檢查 API 回傳資料
export interface LeaveAvailabilityResponse {
  leave_type: LeaveType;
  requested_hours: number;
  remaining_hours: number;
  used_hours: number;
  max_hours_per_year: number;
  max_days_per_year: number;
  is_available: boolean;
  can_apply: boolean;
  suggestion: string | null;
  seniority_years?: number;
}
