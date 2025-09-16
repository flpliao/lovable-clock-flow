import { Salary } from '@/types/salary';

/**
 * 計算薪資的津貼總額
 */
export const calculateAllowances = (salary: Salary): number => {
  const mealAllowance = salary.meal_allowance || 0;
  const attendanceBonus = salary.attendance_bonus || 0;
  const supervisorAllowance = salary.supervisor_allowance || 0;
  const transportationAllowance = salary.transportation_allowance || 0;
  const positionAllowance = salary.position_allowance || 0;
  const professionalAllowance = salary.professional_allowance || 0;
  const holidayBonus = salary.holiday_bonus || 0;
  const birthdayBonus = salary.birthday_bonus || 0;
  const yearEndBonus = salary.year_end_bonus || 0;
  const taxFreeOvertime = salary.tax_free_overtime || 0;
  const taxableOvertime = salary.taxable_overtime || 0;

  const total =
    mealAllowance +
    attendanceBonus +
    supervisorAllowance +
    transportationAllowance +
    positionAllowance +
    professionalAllowance +
    holidayBonus +
    birthdayBonus +
    yearEndBonus +
    taxFreeOvertime +
    taxableOvertime;
  return total;
};

/**
 * 計算薪資的扣除總額
 */
export const calculateDeductions = (salary: Salary): number => {
  const laborInsurancePersonal = salary.labor_insurance_personal || 0;
  const laborPensionPersonal = salary.labor_pension_personal || 0;
  const healthInsurancePersonal = salary.health_insurance_personal || 0;
  const leaveDeduction = salary.leave_deduction || 0;
  const lateDeduction = salary.late_deduction || 0;
  const earlyLeaveDeduction = salary.early_leave_deduction || 0;
  const overtimeBreakDeduction = salary.overtime_break_deduction || 0;
  const absenteeismDeduction = salary.absenteeism_deduction || 0;

  const total =
    laborInsurancePersonal +
    laborPensionPersonal +
    healthInsurancePersonal +
    leaveDeduction +
    lateDeduction +
    earlyLeaveDeduction +
    overtimeBreakDeduction +
    absenteeismDeduction;
  return total;
};

/**
 * 計算薪資的實領總額
 */
export const calculateTotalSalary = (salary: Salary): number => {
  const basicSalary = salary.basic_salary || 0;
  const allowances = calculateAllowances(salary);
  const deductions = calculateDeductions(salary);

  const total = basicSalary + allowances - deductions;
  return total;
};

/**
 * 計算薪資的所有詳細資訊（津貼、扣除、總薪資）
 */
export const calculateSalaryDetails = (salary: Salary) => {
  const allowances = calculateAllowances(salary);
  const deductions = calculateDeductions(salary);
  const totalSalary = calculateTotalSalary(salary);

  return {
    allowances,
    deductions,
    totalSalary,
  };
};

/**
 * 為薪資記錄陣列添加計算好的欄位
 */
export const addCalculatedFieldsToSalaries = (salaries: Salary[]): Salary[] => {
  return salaries.map(salary => {
    const { allowances, deductions, totalSalary } = calculateSalaryDetails(salary);
    return {
      ...salary,
      allowances,
      deductions,
      totalSalary,
    };
  });
};
