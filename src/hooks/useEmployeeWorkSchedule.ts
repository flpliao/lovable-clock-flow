import {
  bulkSyncEmployeeWorkSchedules,
  getEmployeeWithWorkSchedules,
} from '@/services/employeeWorkScheduleService';
import { useEmployeeWorkScheduleStore } from '@/stores/employeeWorkScheduleStore';
import type { Employee } from '@/types/employee';
import dayjs from 'dayjs';

export const useEmployeeWorkSchedule = () => {
  const { isLoading, setIsLoading, error, setError } = useEmployeeWorkScheduleStore();

  const {
    employeesBySlug,
    setEmployees,
    addEmployeesForDepartment,
    addEmployeeWorkSchedule,
    setEmployeeWorkSchedule,
    removeEmployeeWorkSchedule,
    reset,
    getEmployeeBySlug,
    getEmployeesByDepartment,
    getEmployeeWorkSchedule,
    getEmployeeWorkSchedules,
    getEmployeeWorkSchedulesByDate,
    isDepartmentPeriodLoaded,
    isDepartmentDateLoaded,
    getLoadedPeriodsForDepartment,
    markDepartmentPeriodLoaded,
  } = useEmployeeWorkScheduleStore();

  // 載入部門的所有員工資料（不指定時期）
  const loadDepartmentAllEmployees = async ({ departmentSlug }: { departmentSlug: string }) => {
    setIsLoading(true);
    setError(null);

    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
    });
    addEmployeesForDepartment({ departmentSlug, employees });
    setIsLoading(false);
    return employees;
  };

  // 載入部門特定時期的員工資料
  const loadDepartmentByPeriod = async ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => {
    setIsLoading(true);
    setError(null);

    // 如果該時期已經載入，直接返回
    if (isDepartmentPeriodLoaded({ departmentSlug, period })) {
      const employees = getEmployeesByDepartment(departmentSlug);
      setIsLoading(false);
      return employees;
    }

    // 使用 dayjs 計算該月的開始和結束日期
    const periodDate = dayjs(period, 'YYYY-MM');
    const startDate = periodDate.format('YYYY-MM-DD');
    const endDate = periodDate.endOf('month').format('YYYY-MM-DD');

    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
      start_date: startDate,
      end_date: endDate,
    });

    addEmployeesForDepartment({ departmentSlug, employees, period });
    setIsLoading(false);
    return employees;
  };

  // 載入部門特定日期的員工資料
  const loadDepartmentByDate = async ({
    departmentSlug,
    date,
  }: {
    departmentSlug: string;
    date: string;
  }) => {
    setIsLoading(true);
    setError(null);

    // 檢查該日期的時期是否已載入
    if (isDepartmentDateLoaded({ departmentSlug, date })) {
      const employees = getEmployeesByDepartment(departmentSlug);
      setIsLoading(false);
      return employees;
    }

    // 載入該日期所在的整天資料（使用 start_date 和 end_date）
    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
      start_date: date,
      end_date: date,
    });

    // 使用 dayjs 自動推斷時期並標記為已載入
    const period = dayjs(date).format('YYYY-MM');
    addEmployeesForDepartment({ departmentSlug, employees, period });
    setIsLoading(false);
    return employees;
  };

  // 載入部門特定日期範圍的員工資料
  const loadDepartmentByDateRange = async ({
    departmentSlug,
    startDate,
    endDate,
  }: {
    departmentSlug: string;
    startDate: string;
    endDate: string;
  }) => {
    setIsLoading(true);
    setError(null);

    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
      start_date: startDate,
      end_date: endDate,
    });

    // 使用 dayjs 推斷涵蓋的時期並標記為已載入
    const startPeriod = dayjs(startDate).format('YYYY-MM');
    const endPeriod = dayjs(endDate).format('YYYY-MM');

    // 如果範圍在同一個月內，標記該月為已載入
    if (startPeriod === endPeriod) {
      addEmployeesForDepartment({ departmentSlug, employees, period: startPeriod });
    } else {
      // 跨月範圍，不標記特定時期（因為可能不完整）
      addEmployeesForDepartment({ departmentSlug, employees });
    }

    setIsLoading(false);
    return employees;
  };

  // 載入部門特定年月的員工資料
  const loadDepartmentByMonth = async ({
    departmentSlug,
    year,
    month,
  }: {
    departmentSlug: string;
    year: number;
    month: number;
  }) => {
    const period = dayjs()
      .year(year)
      .month(month - 1)
      .format('YYYY-MM');
    return loadDepartmentByPeriod({ departmentSlug, period });
  };

  // 檢查特定年月是否已載入
  const isDepartmentMonthLoaded = ({
    departmentSlug,
    year,
    month,
  }: {
    departmentSlug: string;
    year: number;
    month: number;
  }) => {
    const period = dayjs()
      .year(year)
      .month(month - 1)
      .format('YYYY-MM');
    return isDepartmentPeriodLoaded({ departmentSlug, period });
  };

  // 批量同步員工工作排程
  const handleBulkSyncEmployeeWorkSchedules = async ({
    employees,
    year,
    month,
    onSuccess,
    onError,
  }: {
    employees: Employee[];
    year: number;
    month: number;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    setIsLoading(true);
    setError(null);

    // 轉換資料格式為結構化格式
    const schedules: Array<{
      employee_slug: string;
      work_schedule_slug: string;
      date: string;
    }> = [];

    employees.forEach(employee => {
      if (employee.work_schedules && Array.isArray(employee.work_schedules)) {
        employee.work_schedules.forEach(workSchedule => {
          const date = workSchedule.pivot?.date;

          // 使用 dayjs 驗證日期格式和有效性
          if (workSchedule.slug && date) {
            const parsedDate = dayjs(date, 'YYYY-MM-DD', true);
            if (parsedDate.isValid()) {
              schedules.push({
                employee_slug: employee.slug,
                work_schedule_slug: workSchedule.slug,
                date: date,
              });
            } else {
              console.warn(`無效的日期格式: ${date} (員工: ${employee.slug})`);
            }
          }
        });
      }
    });

    const result = await bulkSyncEmployeeWorkSchedules({
      month,
      year,
      schedules,
    });

    if (result) {
      setIsLoading(false);
      onSuccess?.();
      return true;
    } else {
      setError('批量同步失敗');
      setIsLoading(false);
      onError?.();
      return false;
    }
  };

  return {
    // 狀態
    employeesBySlug,
    isLoading,
    error,

    // 操作方法
    loadDepartmentAllEmployees,
    loadDepartmentByPeriod,
    loadDepartmentByDate,
    loadDepartmentByDateRange,
    loadDepartmentByMonth,
    handleBulkSyncEmployeeWorkSchedules,

    // 查詢方法
    getEmployeeBySlug,
    getEmployeesByDepartment,
    getEmployeeWorkSchedule,
    getEmployeeWorkSchedules,
    getEmployeeWorkSchedulesByDate,
    isDepartmentPeriodLoaded,
    isDepartmentDateLoaded,
    isDepartmentMonthLoaded,
    getLoadedPeriodsForDepartment,
    markDepartmentPeriodLoaded,

    // 直接操作方法（用於本地狀態管理）
    setEmployees,
    addEmployeesForDepartment,
    addEmployeeWorkSchedule,
    setEmployeeWorkSchedule,
    removeEmployeeWorkSchedule,
    reset,
  };
};
