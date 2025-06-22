
export interface LeaveType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  is_paid: boolean;
  annual_reset: boolean;
  max_days_per_year?: number;
  max_days_per_month?: number;
  requires_attachment: boolean;
  requires_approval: boolean;
  gender_restriction?: 'male' | 'female' | null;
  description?: string;
  special_rules?: any;
  is_active: boolean;
  is_system_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SalaryStructure {
  id: string;
  position: string;
  department: string;
  level: number;
  base_salary: number;
  overtime_rate: number;
  holiday_rate: number;
  allowances: any; // 使用 any 以配合 Supabase 的 Json 類型
  benefits: any; // 使用 any 以配合 Supabase 的 Json 類型
  is_active: boolean;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

export interface Payroll {
  id: string;
  staff_id: string;
  salary_structure_id: string;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  overtime_hours?: number;
  overtime_pay?: number;
  holiday_hours?: number;
  holiday_pay?: number;
  allowances?: number;
  deductions?: number;
  gross_salary: number;
  tax?: number;
  labor_insurance?: number;
  health_insurance?: number;
  net_salary: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  calculated_at?: string;
  approved_by?: string;
  approval_date?: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}
