
import { useState, useEffect } from 'react';

interface PayrollFormData {
  staff_id: string;
  salary_structure_id: string;
  pay_period_start: string;
  pay_period_end: string;
  base_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  holiday_hours: number;
  holiday_pay: number;
  allowances: number;
  deductions: number;
  tax: number;
  labor_insurance: number;
  health_insurance: number;
  gross_salary: number;
  net_salary: number;
  status: string;
}

export const usePayrollForm = (initialData?: any, salaryStructures: any[] = []) => {
  const [formData, setFormData] = useState<PayrollFormData>({
    staff_id: '',
    salary_structure_id: '',
    pay_period_start: '',
    pay_period_end: '',
    base_salary: 0,
    overtime_hours: 0,
    overtime_pay: 0,
    holiday_hours: 0,
    holiday_pay: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
    labor_insurance: 0,
    health_insurance: 0,
    gross_salary: 0,
    net_salary: 0,
    status: 'draft'
  });

  // 初始化表單資料
  useEffect(() => {
    if (initialData) {
      console.log('📝 載入編輯資料:', initialData);
      setFormData({
        staff_id: initialData.staff_id || '',
        salary_structure_id: initialData.salary_structure_id || '',
        pay_period_start: initialData.pay_period_start || '',
        pay_period_end: initialData.pay_period_end || '',
        base_salary: Number(initialData.base_salary) || 0,
        overtime_hours: Number(initialData.overtime_hours) || 0,
        overtime_pay: Number(initialData.overtime_pay) || 0,
        holiday_hours: Number(initialData.holiday_hours) || 0,
        holiday_pay: Number(initialData.holiday_pay) || 0,
        allowances: Number(initialData.allowances) || 0,
        deductions: Number(initialData.deductions) || 0,
        tax: Number(initialData.tax) || 0,
        labor_insurance: Number(initialData.labor_insurance) || 0,
        health_insurance: Number(initialData.health_insurance) || 0,
        gross_salary: Number(initialData.gross_salary) || 0,
        net_salary: Number(initialData.net_salary) || 0,
        status: initialData.status || 'draft'
      });
    } else {
      // 重置表單
      setFormData({
        staff_id: '',
        salary_structure_id: '',
        pay_period_start: '',
        pay_period_end: '',
        base_salary: 0,
        overtime_hours: 0,
        overtime_pay: 0,
        holiday_hours: 0,
        holiday_pay: 0,
        allowances: 0,
        deductions: 0,
        tax: 0,
        labor_insurance: 0,
        health_insurance: 0,
        gross_salary: 0,
        net_salary: 0,
        status: 'draft'
      });
    }
  }, [initialData]);

  // 計算薪資
  const calculateSalaries = (data: PayrollFormData) => {
    const grossSalary = data.base_salary + data.overtime_pay + data.holiday_pay + data.allowances;
    const netSalary = grossSalary - data.deductions - data.tax - data.labor_insurance - data.health_insurance;
    
    return {
      ...data,
      gross_salary: grossSalary,
      net_salary: netSalary
    };
  };

  // 計算加班費
  const calculateOvertimePay = (hours: number) => {
    const structure = salaryStructures.find(s => s.id === formData.salary_structure_id);
    if (structure && formData.base_salary) {
      const hourlyRate = formData.base_salary / 30 / 8;
      return Math.round(hours * hourlyRate * structure.overtime_rate);
    }
    return 0;
  };

  // 計算假日工作費
  const calculateHolidayPay = (hours: number) => {
    const structure = salaryStructures.find(s => s.id === formData.salary_structure_id);
    if (structure && formData.base_salary) {
      const hourlyRate = formData.base_salary / 30 / 8;
      return Math.round(hours * hourlyRate * structure.holiday_rate);
    }
    return 0;
  };

  // 更新表單資料並重新計算
  const updateFormData = (updates: Partial<PayrollFormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      return calculateSalaries(newData);
    });
  };

  // 處理薪資結構變更
  const handleSalaryStructureChange = (structureId: string) => {
    const structure = salaryStructures.find(s => s.id === structureId);
    if (structure) {
      let allowancesTotal: number = 0;
      if (structure.allowances && typeof structure.allowances === 'object') {
        const allowanceValues = Object.values(structure.allowances) as unknown[];
        allowancesTotal = allowanceValues.reduce<number>((sum: number, val: unknown) => {
          const numVal = Number(val) || 0;
          return sum + numVal;
        }, 0);
      }
      
      const newData = {
        ...formData,
        salary_structure_id: structureId,
        base_salary: structure.base_salary,
        allowances: allowancesTotal
      };
      
      setFormData(calculateSalaries(newData));
    }
  };

  // 處理加班時數變更
  const handleOvertimeHoursChange = (hours: number) => {
    const overtimePay = calculateOvertimePay(hours);
    updateFormData({ 
      overtime_hours: hours,
      overtime_pay: overtimePay
    });
  };

  // 處理假日工作時數變更
  const handleHolidayHoursChange = (hours: number) => {
    const holidayPay = calculateHolidayPay(hours);
    updateFormData({ 
      holiday_hours: hours,
      holiday_pay: holidayPay
    });
  };

  return {
    formData,
    updateFormData,
    handleSalaryStructureChange,
    handleOvertimeHoursChange,
    handleHolidayHoursChange
  };
};
