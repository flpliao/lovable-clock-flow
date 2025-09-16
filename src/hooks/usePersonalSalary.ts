import { getMySalaries } from '@/services/salaryService';
import { usePersonalSalaryStore } from '@/stores/personalSalaryStore';
import { addCalculatedFieldsToSalaries } from '@/utils/salaryUtils';
import { showError } from '@/utils/toast';
import { useMemo } from 'react';

export const usePersonalSalary = () => {
  const {
    // 薪資記錄狀態
    personalSalaries,
    salariesLoading,

    // 薪資記錄相關操作
    setPersonalSalaries,
    setSalariesLoading,
  } = usePersonalSalaryStore();

  // 載入我的薪資記錄
  const loadMySalaries = async () => {
    if (salariesLoading || personalSalaries.length > 0) return;

    setSalariesLoading(true);
    try {
      const salaries = await getMySalaries();
      const salariesWithCalculatedFields = addCalculatedFieldsToSalaries(salaries);

      setPersonalSalaries(salariesWithCalculatedFields);
      return salariesWithCalculatedFields;
    } catch (error) {
      const message = error instanceof Error ? error.message : '載入薪資記錄失敗';
      showError(message);
      throw error;
    } finally {
      setSalariesLoading(false);
    }
  };

  // 計算統計資料
  const salaryStats = useMemo(() => {
    if (!personalSalaries.length) {
      return {
        totalBasicSalary: 0,
        totalMealAllowance: 0,
        totalAttendanceBonus: 0,
        totalOvertime: 0,
        totalPersonalDeductions: 0,
        averageBasicSalary: 0,
      };
    }

    const totalBasicSalary = personalSalaries.reduce(
      (sum, salary) => sum + (salary.basic_salary || 0),
      0
    );
    const totalMealAllowance = personalSalaries.reduce(
      (sum, salary) => sum + (salary.meal_allowance || 0),
      0
    );
    const totalAttendanceBonus = personalSalaries.reduce(
      (sum, salary) => sum + (salary.attendance_bonus || 0),
      0
    );
    const totalOvertime = personalSalaries.reduce(
      (sum, salary) => sum + (salary.tax_free_overtime || 0) + (salary.taxable_overtime || 0),
      0
    );
    const totalPersonalDeductions = personalSalaries.reduce(
      (sum, salary) =>
        sum +
        (salary.labor_insurance_personal || 0) +
        (salary.labor_pension_personal || 0) +
        (salary.health_insurance_personal || 0),
      0
    );
    const averageBasicSalary = totalBasicSalary / personalSalaries.length;

    return {
      totalBasicSalary,
      totalMealAllowance,
      totalAttendanceBonus,
      totalOvertime,
      totalPersonalDeductions,
      averageBasicSalary,
    };
  }, [personalSalaries]);

  return {
    // 薪資記錄
    personalSalaries,
    salariesLoading,
    loadMySalaries,

    // 統計資料
    salaryStats,
  };
};
