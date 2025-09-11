import {
  batchPublishSalaries,
  createSalary,
  deleteSalary,
  exportSalaries,
  getAllSalaries,
  getSalariesByMonth,
  getSalary,
  getSalaryMonths,
  importSalaries,
  updateSalary,
} from '@/services/salaryService';
import useSalaryStore from '@/stores/salaryStore';
import { Salary } from '@/types/salary';
import { showError, showSuccess } from '@/utils/toast';
import { useMemo } from 'react';

export const useSalary = () => {
  const {
    // 月份列表狀態
    salaryMonths,
    monthsLoading,
    monthsLoaded,

    // 薪資記錄狀態
    salaries,
    salariesLoading,

    // 月份相關操作
    setSalaryMonths,
    addSalaryMonths,
    setMonthsLoading,
    setMonthsLoaded,

    // 薪資記錄相關操作
    setSalaries,
    addSalary,
    addSalaries,
    updateSalary: updateSalaryInStore,
    removeSalary,
    setSalariesLoading,
    isMonthLoaded,
    markMonthAsLoaded,
  } = useSalaryStore();

  // 載入薪資月份列表（帶快取）
  const loadSalaryMonths = async () => {
    // 如果已經載入過，則直接返回
    if (monthsLoaded) {
      return;
    }

    if (monthsLoading) return;
    setMonthsLoading(true);

    try {
      const data = await getSalaryMonths();
      setSalaryMonths(data);
      setMonthsLoaded(true); // 標記為已載入
    } catch (error) {
      showError(error.message);
    } finally {
      setMonthsLoading(false);
    }
  };

  // 載入特定月份的薪資記錄
  const loadSalariesByMonth = async (month: string) => {
    // 檢查該月份是否已經載入過
    if (isMonthLoaded(month)) {
      return;
    }

    if (salariesLoading) return;
    setSalariesLoading(true);

    try {
      const data = await getSalariesByMonth(month);
      setSalaries(data);
      markMonthAsLoaded(month); // 手動標記該月份為已載入
    } catch (error) {
      showError(error.message);
    } finally {
      setSalariesLoading(false);
    }
  };

  // 載入所有薪資記錄（備用方法）
  const loadAllSalaries = async () => {
    if (salariesLoading) return;
    setSalariesLoading(true);

    try {
      const data = await getAllSalaries();
      setSalaries(data);
    } catch (error) {
      showError(error.message);
    } finally {
      setSalariesLoading(false);
    }
  };

  // 取得單一薪資記錄
  const loadSalary = async (slug: string): Promise<Salary | null> => {
    try {
      const data = await getSalary(slug);
      return data;
    } catch (error) {
      showError(error.message);
      return null;
    }
  };

  // 建立薪資記錄
  const handleCreateSalary = async (
    salaryData: Omit<Salary, 'slug' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const newSalary = await createSalary(salaryData);
      addSalary(newSalary);
      showSuccess('薪資記錄建立成功');
      return newSalary;
    } catch (error) {
      showError(error.message);
      return null;
    }
  };

  // 更新薪資記錄
  const handleUpdateSalary = async (
    slug: string,
    salaryData: Partial<Omit<Salary, 'slug' | 'created_at' | 'updated_at'>>
  ) => {
    try {
      const updatedSalary = await updateSalary(slug, salaryData);
      updateSalaryInStore(slug, updatedSalary);
      showSuccess('薪資記錄更新成功');
      return updatedSalary;
    } catch (error) {
      showError(error.message);
      return null;
    }
  };

  // 刪除薪資記錄
  const handleDeleteSalary = async (slug: string) => {
    try {
      await deleteSalary(slug);
      removeSalary(slug);
      showSuccess('薪資記錄刪除成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 匯出薪資資料
  const handleExportSalary = async (params?: {
    format?: 'excel' | 'csv' | 'pdf';
    period?: string;
    employee_id?: string;
    status?: string;
    salary_month?: string;
  }) => {
    try {
      const data = await exportSalaries(params);

      // 觸發下載
      if (data.download_url) {
        const link = document.createElement('a');
        link.href = data.download_url;
        link.download = data.file_name || 'salaries_export.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      showSuccess(`薪資資料匯出成功，共 ${data.total_records} 筆記錄`);
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 匯入薪資資料
  const handleImportSalary = async (file: File) => {
    try {
      const { data, summary } = await importSalaries(file);
      addSalaries(data);

      const months = data.map(salary => salary.salary_month);
      const uniqueMonths = [...new Set(months)]; // 去重複
      addSalaryMonths(uniqueMonths);
      markMonthAsLoaded(uniqueMonths); // 支援多筆月份
      showSuccess(`薪資資料匯入成功，共 ${summary.success_count} 筆記錄`);
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 批量發布薪資記錄
  const handleBatchPublishSalaries = async (salarySlugs: string[]) => {
    try {
      const updatedSalaries = await batchPublishSalaries(salarySlugs);

      // 更新 store 中的薪資記錄
      updatedSalaries.forEach(salary => {
        updateSalaryInStore(salary.slug, salary);
      });

      showSuccess(`成功發布 ${updatedSalaries.length} 筆薪資記錄`);
      return updatedSalaries;
    } catch (error) {
      showError(error.message);
      return [];
    }
  };

  return {
    // 月份列表狀態
    salaryMonths,
    monthsLoading,
    monthsLoaded,

    // 薪資記錄狀態
    salaries,
    salariesLoading,

    // 載入方法
    loadSalaryMonths,
    loadSalariesByMonth,
    loadAllSalaries,
    loadSalary,

    // 操作方法
    handleCreateSalary,
    handleUpdateSalary,
    handleDeleteSalary,
    handleBatchPublishSalaries,
    handleExportSalary,
    handleImportSalary,
  };
};

// 根據狀態篩選薪資記錄的 hook
export const useSalaryByStatus = (status?: string) => {
  const { salaries } = useSalaryStore();
  return useMemo(() => {
    if (!status) return salaries;
    return salaries.filter(salary => salary.salary_type === status);
  }, [salaries, status]);
};

// 根據月份篩選薪資記錄的 hook
export const useSalaryByMonth = (month?: string) => {
  const { salaries } = useSalaryStore();
  return useMemo(() => {
    if (!month) return salaries;
    return salaries.filter(salary => salary.salary_month === month);
  }, [salaries, month]);
};

// 根據員工篩選薪資記錄的 hook
export const useSalaryByEmployee = (employeeSlug?: string) => {
  const { salaries } = useSalaryStore();
  return useMemo(() => {
    if (!employeeSlug) return salaries;
    return salaries.filter(salary => salary.employee_id === employeeSlug);
  }, [salaries, employeeSlug]);
};
