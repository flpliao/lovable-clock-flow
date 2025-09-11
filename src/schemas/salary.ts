import { SalaryStatus, SalaryType } from '@/types/salary';
import { z } from 'zod';

// 薪資表單驗證 Schema
export const salaryFormSchema = z.object({
  // 基本資訊
  salary_month: z.string().min(1, '薪資年月為必填'),
  income_month: z.string().optional(),
  employee_slug: z.string().min(1, '員工代碼為必填'),
  employee_name: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  salary_type: z.nativeEnum(SalaryType).default(SalaryType.MONTHLY),

  // 薪資項目
  basic_salary: z.coerce.number().min(0, '基本薪資不能為負數').default(0),
  meal_allowance: z.coerce.number().min(0).default(0),
  attendance_bonus: z.coerce.number().min(0).default(0),
  supervisor_allowance: z.coerce.number().min(0).default(0),
  transportation_allowance: z.coerce.number().min(0).default(0),
  position_allowance: z.coerce.number().min(0).default(0),
  professional_allowance: z.coerce.number().min(0).default(0),
  holiday_bonus: z.coerce.number().min(0).default(0),
  birthday_bonus: z.coerce.number().min(0).default(0),
  year_end_bonus: z.coerce.number().min(0).default(0),

  // 加班費
  tax_free_overtime: z.coerce.number().min(0).default(0),
  taxable_overtime: z.coerce.number().min(0).default(0),

  // 不休假代金
  unused_leave_compensation_special: z.coerce.number().min(0).default(0),
  unused_leave_compensation_compensatory: z.coerce.number().min(0).default(0),
  tax_free_unused_leave_compensatory: z.coerce.number().min(0).default(0),
  taxable_unused_leave_compensatory: z.coerce.number().min(0).default(0),
  unused_leave_compensation_monthly: z.coerce.number().min(0).default(0),
  unused_leave_compensation_other: z.coerce.number().min(0).default(0),

  // 其他項目
  severance_pay: z.coerce.number().min(0).default(0),

  // 扣款項目
  labor_insurance_personal: z.coerce.number().min(0).default(0),
  labor_pension_personal: z.coerce.number().min(0).default(0),
  health_insurance_personal: z.coerce.number().min(0).default(0),
  leave_deduction: z.coerce.number().min(0).default(0),
  late_deduction: z.coerce.number().min(0).default(0),
  early_leave_deduction: z.coerce.number().min(0).default(0),
  overtime_break_deduction: z.coerce.number().min(0).default(0),
  absenteeism_deduction: z.coerce.number().min(0).default(0),

  // 雇主負擔
  labor_insurance_employer: z.coerce.number().min(0).default(0),
  occupational_insurance_employer: z.coerce.number().min(0).default(0),
  health_insurance_employer: z.coerce.number().min(0).default(0),
  labor_pension_employer: z.coerce.number().min(0).default(0),

  // 狀態
  status: z.nativeEnum(SalaryStatus).default(SalaryStatus.DRAFT),
});

// 薪資表單資料類型
export type SalaryFormData = z.infer<typeof salaryFormSchema>;

// 新增薪資表單資料類型（不包含 slug, created_at, updated_at）
export type CreateSalaryFormData = Omit<SalaryFormData, 'slug' | 'created_at' | 'updated_at'>;

// 編輯薪資表單資料類型（包含所有欄位）
export type EditSalaryFormData = SalaryFormData;
