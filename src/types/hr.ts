// LeaveType interface moved to @/types/leaveType for consistency

export interface SalaryStructure {
  id: string;
  position: string;
  department: string;
  level: number;
  base_salary: number;
  overtime_rate: number;
  holiday_rate: number;
  allowances: Record<string, number | string | boolean>; // 津貼項目，例如：交通津貼、餐費津貼等
  benefits: Record<string, number | string | boolean>; // 福利項目，例如：保險、獎金等
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
