
// 加班相關類型定義
export interface OvertimeType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  description?: string;
  compensation_type: 'overtime_pay' | 'compensatory_time';
  max_hours_per_day?: number;
  max_hours_per_month?: number;
  requires_approval: boolean;
  requires_attachment: boolean;
  is_active: boolean;
  is_system_default: boolean;
  special_rules?: Record<string, any>;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OvertimeRequest {
  id: string;
  user_id?: string;
  staff_id?: string;
  overtime_type: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  attachment_url?: string;
  approval_level?: number;
  current_approver?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface OvertimeApprovalRecord {
  id: string;
  overtime_request_id: string;
  approver_id?: string;
  approver_name: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  approval_date?: string;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface OvertimeFormData {
  overtime_type: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  reason: string;
  compensation_type?: string;
  attachment?: File;
}
