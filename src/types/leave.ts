// 請假申請記錄
export interface LeaveRequest {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  leave_type: 'annual' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  hours: number;
  reason: string;
  approval_level: number;
  current_approver?: string;
  created_at: string;
  updated_at: string;
  approvals: ApprovalRecord[];
}

// 審核記錄
export interface ApprovalRecord {
  id: string;
  leave_request_id: string;
  approver_id: string;
  approver_name: string;
  status: 'pending' | 'approved' | 'rejected';
  level: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

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

// 請假類型選項
export interface LeaveTypeOption {
  value: 'annual' | 'sick' | 'personal' | 'other';
  label: string;
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
