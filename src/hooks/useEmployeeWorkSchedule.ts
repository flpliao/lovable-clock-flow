import {
  bulkSyncEmployeeWorkSchedules,
  getEmployeeWithWorkSchedules,
} from '@/services/employeeWorkScheduleService';
import { useEmployeeWorkScheduleStore } from '@/stores/employeeWorkScheduleStore';
import { EmployeeWithWorkSchedules } from '@/types/employee';

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

  // 載入員工工作排程資料
  const loadEmployeeWorkSchedules = async (params?: {
    date?: string;
    department_slug?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    const data = await getEmployeeWithWorkSchedules(params);
    setEmployees(data);
    setIsLoading(false);
    return data;
  };

  // 載入部門的所有員工資料（不指定時期）
  const loadDepartmentAllEmployees = async (departmentSlug: string) => {
    setIsLoading(true);
    setError(null);

    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
    });
    addEmployeesForDepartment(departmentSlug, employees);
    setIsLoading(false);
    return employees;
  };

  // 載入部門特定時期的員工資料
  const loadDepartmentByPeriod = async (departmentSlug: string, period: string) => {
    setIsLoading(true);
    setError(null);

    // 如果該時期已經載入，直接返回
    if (isDepartmentPeriodLoaded(departmentSlug, period)) {
      const employees = getEmployeesByDepartment(departmentSlug);
      setIsLoading(false);
      return employees;
    }

    // 從 period (YYYY-MM) 計算該月的開始和結束日期
    const [year, month] = period.split('-');
    const startDate = `${year}-${month}-01`;
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    const endDate = `${year}-${month}-${daysInMonth.toString().padStart(2, '0')}`;

    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
      start_date: startDate,
      end_date: endDate,
    });

    addEmployeesForDepartment(departmentSlug, employees, period);
    setIsLoading(false);
    return employees;
  };

  // 載入部門特定日期的員工資料
  const loadDepartmentByDate = async (departmentSlug: string, date: string) => {
    setIsLoading(true);
    setError(null);

    // 檢查該日期的時期是否已載入
    if (isDepartmentDateLoaded(departmentSlug, date)) {
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

    // 自動推斷時期並標記為已載入
    const period = date.substring(0, 7); // YYYY-MM
    addEmployeesForDepartment(departmentSlug, employees, period);
    setIsLoading(false);
    return employees;
  };

  // 載入部門特定日期範圍的員工資料
  const loadDepartmentByDateRange = async (
    departmentSlug: string,
    startDate: string,
    endDate: string
  ) => {
    setIsLoading(true);
    setError(null);

    const employees = await getEmployeeWithWorkSchedules({
      department_slug: departmentSlug,
      start_date: startDate,
      end_date: endDate,
    });

    // 推斷涵蓋的時期並標記為已載入
    const startPeriod = startDate.substring(0, 7);
    const endPeriod = endDate.substring(0, 7);

    // 如果範圍在同一個月內，標記該月為已載入
    if (startPeriod === endPeriod) {
      addEmployeesForDepartment(departmentSlug, employees, startPeriod);
    } else {
      // 跨月範圍，不標記特定時期（因為可能不完整）
      addEmployeesForDepartment(departmentSlug, employees);
    }

    setIsLoading(false);
    return employees;
  };

  // 載入部門特定年月的員工資料
  const loadDepartmentByMonth = async (departmentSlug: string, year: number, month: number) => {
    const period = `${year}-${month.toString().padStart(2, '0')}`;
    return loadDepartmentByPeriod(departmentSlug, period);
  };

  // 檢查特定年月是否已載入
  const isDepartmentMonthLoaded = (departmentSlug: string, year: number, month: number) => {
    const period = `${year}-${month.toString().padStart(2, '0')}`;
    return isDepartmentPeriodLoaded(departmentSlug, period);
  };

  // 批量同步員工工作排程
  const handleBulkSyncEmployeeWorkSchedules = async (
    employees: EmployeeWithWorkSchedules[],
    year: number,
    month: number,
    onSuccess?: () => void,
    onError?: () => void
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // 轉換資料格式為結構化格式
      const schedules: Array<{
        employee_slug: string;
        work_schedule_slug: string;
        date: string;
      }> = [];

      employees.forEach(employee => {
        if (employee.work_schedules && Array.isArray(employee.work_schedules)) {
          employee.work_schedules.forEach(workSchedule => {
            // 驗證日期格式是否正確 (YYYY-MM-DD)
            const date = workSchedule.pivot?.date;
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (workSchedule.slug && date && dateRegex.test(date)) {
              schedules.push({
                employee_slug: employee.slug,
                work_schedule_slug: workSchedule.slug,
                date: date,
              });
            } else if (date && !dateRegex.test(date)) {
              console.warn(`無效的日期格式: ${date} (員工: ${employee.slug})`);
            }
          });
        }
      });

      const payload = {
        month,
        year,
        schedules,
      };

      // 除錯資訊
      console.log('準備同步的資料:', {
        month,
        year,
        schedulesCount: schedules.length,
        sampleSchedules: schedules.slice(0, 3), // 顯示前3筆資料作為範例
      });

      const result = await bulkSyncEmployeeWorkSchedules(payload);

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
    } catch (error) {
      setError(`批量同步失敗: ${error}`);
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
    loadEmployeeWorkSchedules,
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
