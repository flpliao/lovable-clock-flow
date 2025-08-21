// 請假表單資料
export interface LeaveFormData {
  start_date: Date;
  end_date: Date;
  leave_type: 'annual' | 'sick' | 'personal' | 'other';
  reason: string;
}

// 請假餘額
export interface LeaveBalance {
  total_days: number;
  used_days: number;
  remaining_days: number;
  year: number;
}

// 請假統計
export interface LeaveStatistics {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  total_hours: number;
}

// 請假狀態標籤
export interface LeaveStatusLabel {
  label: string;
  color: string;
}

// 請假驗證結果
export interface LeaveValidationResult {
  isValid: boolean;
  errors: string[];
}
