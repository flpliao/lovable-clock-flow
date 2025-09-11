import { Salary } from '@/types/salary';
import { useEffect, useState } from 'react';

interface SalaryFormData {
  employee_id: string;
  salary_month: string;
  income_month: string;
  employee_number: string;
  employee_name: string;
  department: string;
  position: string;
  salary_type: string;
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
}

export const useSalaryForm = (initialData?: Salary) => {
  const [formData, setFormData] = useState<SalaryFormData>({
    employee_id: '',
    salary_month: '',
    income_month: '',
    employee_number: '',
    employee_name: '',
    department: '',
    position: '',
    salary_type: 'monthly',
    basic_salary: 0,
    meal_allowance: 0,
    attendance_bonus: 0,
    supervisor_allowance: 0,
    transportation_allowance: 0,
    position_allowance: 0,
    professional_allowance: 0,
    holiday_bonus: 0,
    birthday_bonus: 0,
    year_end_bonus: 0,
    tax_free_overtime: 0,
    taxable_overtime: 0,
    unused_leave_compensation_special: 0,
    unused_leave_compensation_compensatory: 0,
    tax_free_unused_leave_compensatory: 0,
    taxable_unused_leave_compensatory: 0,
    unused_leave_compensation_monthly: 0,
    unused_leave_compensation_other: 0,
    severance_pay: 0,
    labor_insurance_personal: 0,
    labor_pension_personal: 0,
    health_insurance_personal: 0,
    leave_deduction: 0,
    late_deduction: 0,
    early_leave_deduction: 0,
    overtime_break_deduction: 0,
    absenteeism_deduction: 0,
    labor_insurance_employer: 0,
    occupational_insurance_employer: 0,
    health_insurance_employer: 0,
    labor_pension_employer: 0,
  });

  // 初始化表單資料
  useEffect(() => {
    if (initialData) {
      console.log('📝 載入編輯資料:', initialData);
      setFormData({
        employee_id: initialData.employee_id || '',
        salary_month: initialData.salary_month || '',
        income_month: initialData.income_month || '',
        employee_number: initialData.employee_number || '',
        employee_name: initialData.employee_name || '',
        department: initialData.department || '',
        position: initialData.position || '',
        salary_type: initialData.salary_type || 'monthly',
        basic_salary: Number(initialData.basic_salary) || 0,
        meal_allowance: Number(initialData.meal_allowance) || 0,
        attendance_bonus: Number(initialData.attendance_bonus) || 0,
        supervisor_allowance: Number(initialData.supervisor_allowance) || 0,
        transportation_allowance: Number(initialData.transportation_allowance) || 0,
        position_allowance: Number(initialData.position_allowance) || 0,
        professional_allowance: Number(initialData.professional_allowance) || 0,
        holiday_bonus: Number(initialData.holiday_bonus) || 0,
        birthday_bonus: Number(initialData.birthday_bonus) || 0,
        year_end_bonus: Number(initialData.year_end_bonus) || 0,
        tax_free_overtime: Number(initialData.tax_free_overtime) || 0,
        taxable_overtime: Number(initialData.taxable_overtime) || 0,
        unused_leave_compensation_special:
          Number(initialData.unused_leave_compensation_special) || 0,
        unused_leave_compensation_compensatory:
          Number(initialData.unused_leave_compensation_compensatory) || 0,
        tax_free_unused_leave_compensatory:
          Number(initialData.tax_free_unused_leave_compensatory) || 0,
        taxable_unused_leave_compensatory:
          Number(initialData.taxable_unused_leave_compensatory) || 0,
        unused_leave_compensation_monthly:
          Number(initialData.unused_leave_compensation_monthly) || 0,
        unused_leave_compensation_other: Number(initialData.unused_leave_compensation_other) || 0,
        severance_pay: Number(initialData.severance_pay) || 0,
        labor_insurance_personal: Number(initialData.labor_insurance_personal) || 0,
        labor_pension_personal: Number(initialData.labor_pension_personal) || 0,
        health_insurance_personal: Number(initialData.health_insurance_personal) || 0,
        leave_deduction: Number(initialData.leave_deduction) || 0,
        late_deduction: Number(initialData.late_deduction) || 0,
        early_leave_deduction: Number(initialData.early_leave_deduction) || 0,
        overtime_break_deduction: Number(initialData.overtime_break_deduction) || 0,
        absenteeism_deduction: Number(initialData.absenteeism_deduction) || 0,
        labor_insurance_employer: Number(initialData.labor_insurance_employer) || 0,
        occupational_insurance_employer: Number(initialData.occupational_insurance_employer) || 0,
        health_insurance_employer: Number(initialData.health_insurance_employer) || 0,
        labor_pension_employer: Number(initialData.labor_pension_employer) || 0,
      });
    } else {
      // 重置表單並設定預設日期
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      // 預設薪資月份為當月
      const salaryMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

      setFormData({
        employee_id: '',
        salary_month: salaryMonth,
        income_month: salaryMonth,
        employee_number: '',
        employee_name: '',
        department: '',
        position: '',
        salary_type: 'monthly',
        basic_salary: 0,
        meal_allowance: 0,
        attendance_bonus: 0,
        supervisor_allowance: 0,
        transportation_allowance: 0,
        position_allowance: 0,
        professional_allowance: 0,
        holiday_bonus: 0,
        birthday_bonus: 0,
        year_end_bonus: 0,
        tax_free_overtime: 0,
        taxable_overtime: 0,
        unused_leave_compensation_special: 0,
        unused_leave_compensation_compensatory: 0,
        tax_free_unused_leave_compensatory: 0,
        taxable_unused_leave_compensatory: 0,
        unused_leave_compensation_monthly: 0,
        unused_leave_compensation_other: 0,
        severance_pay: 0,
        labor_insurance_personal: 0,
        labor_pension_personal: 0,
        health_insurance_personal: 0,
        leave_deduction: 0,
        late_deduction: 0,
        early_leave_deduction: 0,
        overtime_break_deduction: 0,
        absenteeism_deduction: 0,
        labor_insurance_employer: 0,
        occupational_insurance_employer: 0,
        health_insurance_employer: 0,
        labor_pension_employer: 0,
      });
    }
  }, [initialData]);

  // 更新表單資料
  const updateFormData = (updates: Partial<SalaryFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return {
    formData,
    updateFormData,
  };
};
