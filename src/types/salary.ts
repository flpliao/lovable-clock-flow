import { Employee } from './employee';

// 薪資狀態枚舉
export enum SalaryStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAID = 'paid',
}

// 薪資類別枚舉
export enum SalaryType {
  MONTHLY = 'monthly',
  HOURLY = 'hourly',
  DAILY = 'daily',
  PIECEWORK = 'piecework',
  OTHER = 'other',
}

// 薪資類別顯示名稱對應
export const SALARY_TYPE_LABELS: Record<SalaryType, string> = {
  [SalaryType.MONTHLY]: '月薪',
  [SalaryType.HOURLY]: '時薪',
  [SalaryType.DAILY]: '日薪',
  [SalaryType.PIECEWORK]: '計件',
  [SalaryType.OTHER]: '其他',
};

// 薪資記錄類型定義
export interface Salary {
  slug: string;
  company_id?: string;
  employee_id: string;
  salary_month: string;
  income_month: string;
  employee_slug: string;
  employee?: Employee;
  employee_name: string;
  department: string;
  position: string;
  salary_type: SalaryType;
  basic_salary: number;
  meal_allowance: number;
  attendance_bonus: number;
  supervisor_allowance: number;
  transportation_allowance: number;
  position_allowance: number;
  professional_allowance: number;
  holiday_bonus: number;
  birthday_bonus: number;
  year_end_bonus: number;
  tax_free_overtime: number;
  taxable_overtime: number;
  unused_leave_compensation_special: number;
  unused_leave_compensation_compensatory: number;
  tax_free_unused_leave_compensatory: number;
  taxable_unused_leave_compensatory: number;
  unused_leave_compensation_monthly: number;
  unused_leave_compensation_other: number;
  severance_pay: number;
  labor_insurance_personal: number;
  labor_pension_personal: number;
  health_insurance_personal: number;
  leave_deduction: number;
  late_deduction: number;
  early_leave_deduction: number;
  overtime_break_deduction: number;
  absenteeism_deduction: number;
  labor_insurance_employer: number;
  occupational_insurance_employer: number;
  health_insurance_employer: number;
  labor_pension_employer: number;
  status?: SalaryStatus;
  totalSalary?: number; // 計算後的實領薪資總額
  allowances?: number; // 計算後的津貼總額
  deductions?: number; // 計算後的扣除總額
  created_at: string;
  updated_at: string;
}

// 薪資統計類型定義
export interface SalaryStatistics {
  total_employees: number;
  total_basic_salary: number;
  total_meal_allowance: number;
  total_attendance_bonus: number;
  total_overtime: number;
  total_personal_deductions: number;
  total_employer_costs: number;
  salary_by_type: Array<{
    salary_type: SalaryType;
    count: number;
  }>;
  salary_by_department: Array<{
    department: string;
    count: number;
    total_salary: number;
  }>;
}

// 薪資月份類型定義
export type SalaryMonth = string;
