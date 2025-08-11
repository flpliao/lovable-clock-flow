import type { EmployeesBySlug, EmployeeWithWorkSchedules } from '@/types/employee';
import type { WorkSchedule } from '@/types/workSchedule';
import { datesToPeriods, dateToPeriod } from '@/utils/dateUtils';
import { create } from 'zustand';
interface EmployeeWorkScheduleState {
  employeesBySlug: EmployeesBySlug;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // 已載入的部門與時間週期記錄 (departmentSlug -> Set of periods "YYYY-MM")
  loadedDepartmentPeriods: Record<string, Set<string>>;

  // 基本操作方法
  setEmployees: (employees: EmployeeWithWorkSchedules[]) => void;
  addEmployeesForDepartment: ({
    departmentSlug,
    employees,
    period,
  }: {
    departmentSlug: string;
    employees: EmployeeWithWorkSchedules[];
    period?: string;
  }) => void;

  // 工作排程相關操作
  addEmployeeWorkSchedule: ({
    employeeSlug,
    date,
    workSchedule,
  }: {
    employeeSlug: string;
    date: string;
    workSchedule: WorkSchedule;
  }) => void;
  setEmployeeWorkSchedule: ({
    employeeSlug,
    date,
    updates,
  }: {
    employeeSlug: string;
    date: string;
    updates: Partial<WorkSchedule>;
  }) => void;
  removeEmployeeWorkSchedule: ({
    employeeSlug,
    date,
  }: {
    employeeSlug: string;
    date: string;
  }) => void;

  // 查詢方法
  getEmployeesByDepartment: (departmentSlug: string) => EmployeeWithWorkSchedules[];
  getEmployeeBySlug: (slug: string) => EmployeeWithWorkSchedules;
  getEmployeeWorkSchedule: ({
    employeeSlug,
    date,
  }: {
    employeeSlug: string;
    date: string;
  }) => WorkSchedule | undefined;
  getEmployeeWorkSchedules: (employeeSlug: string) => WorkSchedule[];
  getEmployeeWorkSchedulesByDate: (date: string) => WorkSchedule[];
  isDepartmentPeriodLoaded: ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => boolean;
  getLoadedPeriodsForDepartment: (departmentSlug: string) => string[];
  isDepartmentDateLoaded: ({
    departmentSlug,
    date,
  }: {
    departmentSlug: string;
    date: string;
  }) => boolean;
  markDepartmentPeriodLoaded: ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => void;

  // 狀態管理
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEmployeeWorkScheduleStore = create<EmployeeWorkScheduleState>()((set, get) => ({
  employeesBySlug: {},
  isLoading: false,
  error: null,
  loadedDepartmentPeriods: {},

  // 設定員工資料（全部替換）
  setEmployees: (employees: EmployeeWithWorkSchedules[]) => {
    const employeesBySlug: EmployeesBySlug = {};
    const loadedDepartmentPeriods: Record<string, Set<string>> = {};

    for (const emp of employees) {
      const scheduleDates: string[] = [];

      // 處理純陣列格式的 work_schedules
      if (emp.work_schedules && Array.isArray(emp.work_schedules)) {
        emp.work_schedules.forEach(ws => {
          if (ws.pivot?.date) {
            scheduleDates.push(ws.pivot.date);
          }
        });
      }

      employeesBySlug[emp.slug] = {
        ...emp,
        work_schedules: emp.work_schedules || [],
      };

      // 記錄該員工部門的已載入時期
      if (emp.department?.slug && scheduleDates.length > 0) {
        if (!loadedDepartmentPeriods[emp.department.slug]) {
          loadedDepartmentPeriods[emp.department.slug] = new Set();
        }
        const periods = datesToPeriods(scheduleDates);
        periods.forEach(period => {
          loadedDepartmentPeriods[emp.department.slug].add(period);
        });
      }
    }

    set({ employeesBySlug, loadedDepartmentPeriods, error: null });
  },

  // 為特定部門新增員工（更新或新增）
  addEmployeesForDepartment: ({
    departmentSlug,
    employees,
    period,
  }: {
    departmentSlug: string;
    employees: EmployeeWithWorkSchedules[];
    period?: string;
  }) => {
    const { employeesBySlug, loadedDepartmentPeriods } = get();
    const updatedEmployeesBySlug = { ...employeesBySlug };
    const updatedLoadedDepartmentPeriods = { ...loadedDepartmentPeriods };
    const allScheduleDates: string[] = [];

    // 更新員工資料
    for (const emp of employees) {
      // 處理純陣列格式的 work_schedules
      if (emp.work_schedules && Array.isArray(emp.work_schedules)) {
        emp.work_schedules.forEach(ws => {
          if (ws.pivot?.date) {
            allScheduleDates.push(ws.pivot.date);
          }
        });
      }

      updatedEmployeesBySlug[emp.slug] = {
        ...emp,
        work_schedules: emp.work_schedules || [],
      };
    }

    // 標記部門的特定時期為已載入
    if (!updatedLoadedDepartmentPeriods[departmentSlug]) {
      updatedLoadedDepartmentPeriods[departmentSlug] = new Set();
    }

    if (period) {
      // 如果提供了明確的時期，直接標記
      updatedLoadedDepartmentPeriods[departmentSlug].add(period);
    } else if (allScheduleDates.length > 0) {
      // 如果沒有提供時期，從工作排程推斷
      const periods = datesToPeriods(allScheduleDates);
      periods.forEach(p => {
        updatedLoadedDepartmentPeriods[departmentSlug].add(p);
      });
    }

    set({
      employeesBySlug: updatedEmployeesBySlug,
      loadedDepartmentPeriods: updatedLoadedDepartmentPeriods,
      error: null,
    });
  },

  // 新增員工工作排程
  addEmployeeWorkSchedule: ({
    employeeSlug,
    date,
    workSchedule,
  }: {
    employeeSlug: string;
    date: string;
    workSchedule: WorkSchedule;
  }) => {
    const { employeesBySlug } = get();
    const employee = employeesBySlug[employeeSlug];
    if (employee) {
      const workSchedules = employee.work_schedules || [];
      // 移除同日期的舊排程
      const filteredSchedules = workSchedules.filter(ws => ws.pivot?.date !== date);
      // 新增新排程
      const newWorkSchedule = {
        ...workSchedule,
        pivot: { ...workSchedule.pivot, date },
      };

      const updatedEmployee = {
        ...employee,
        work_schedules: [...filteredSchedules, newWorkSchedule],
      };
      set({
        employeesBySlug: { ...employeesBySlug, [employeeSlug]: updatedEmployee },
        error: null,
      });
    }
  },

  // 更新員工工作排程
  setEmployeeWorkSchedule: ({
    employeeSlug,
    date,
    updates,
  }: {
    employeeSlug: string;
    date: string;
    updates: Partial<WorkSchedule>;
  }) => {
    const { employeesBySlug } = get();
    const employee = employeesBySlug[employeeSlug];
    if (employee && employee.work_schedules) {
      const workSchedules = [...employee.work_schedules];
      const index = workSchedules.findIndex(ws => ws.pivot?.date === date);

      if (index !== -1) {
        workSchedules[index] = { ...workSchedules[index], ...updates };

        const updatedEmployee = {
          ...employee,
          work_schedules: workSchedules,
        };
        set({
          employeesBySlug: { ...employeesBySlug, [employeeSlug]: updatedEmployee },
          error: null,
        });
      }
    }
  },

  // 移除員工工作排程
  removeEmployeeWorkSchedule: ({ employeeSlug, date }: { employeeSlug: string; date: string }) => {
    const { employeesBySlug } = get();
    const employee = employeesBySlug[employeeSlug];
    if (employee && employee.work_schedules) {
      const filteredSchedules = employee.work_schedules.filter(ws => ws.pivot?.date !== date);

      set({
        employeesBySlug: {
          ...employeesBySlug,
          [employeeSlug]: {
            ...employee,
            work_schedules: filteredSchedules,
          },
        },
        error: null,
      });
    }
  },

  // 取得部門的員工列表
  getEmployeesByDepartment: (departmentSlug: string): EmployeeWithWorkSchedules[] => {
    const { employeesBySlug } = get();
    const employeesByDepartment: EmployeeWithWorkSchedules[] = [];

    Object.values(employeesBySlug).forEach(emp => {
      if (emp.department?.slug === departmentSlug) {
        employeesByDepartment.push(emp);
      }
    });

    return employeesByDepartment;
  },

  // 根據 slug 取得員工
  getEmployeeBySlug: (slug: string): EmployeeWithWorkSchedules => {
    const { employeesBySlug } = get();
    return employeesBySlug[slug];
  },

  // 取得員工工作排程
  getEmployeeWorkSchedule: ({ employeeSlug, date }: { employeeSlug: string; date: string }) => {
    const { employeesBySlug } = get();
    const employee = employeesBySlug[employeeSlug];
    return employee?.work_schedules?.find(ws => ws.pivot?.date === date);
  },

  // 取得員工的所有工作排程
  getEmployeeWorkSchedules: (employeeSlug: string): WorkSchedule[] => {
    const { employeesBySlug } = get();
    const employee = employeesBySlug[employeeSlug];
    return employee?.work_schedules || [];
  },

  // 根據日期取得所有工作排程
  getEmployeeWorkSchedulesByDate: (date: string): WorkSchedule[] => {
    const { employeesBySlug } = get();
    const workSchedules: WorkSchedule[] = [];

    Object.values(employeesBySlug).forEach(employee => {
      if (employee.work_schedules) {
        const schedule = employee.work_schedules.find(ws => ws.pivot?.date === date);
        if (schedule) {
          workSchedules.push(schedule);
        }
      }
    });

    return workSchedules;
  },

  // 檢查部門的特定時期是否已載入
  isDepartmentPeriodLoaded: ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => {
    const { loadedDepartmentPeriods } = get();
    return loadedDepartmentPeriods[departmentSlug]?.has(period) ?? false;
  },

  // 取得部門已載入的時期列表
  getLoadedPeriodsForDepartment: (departmentSlug: string) => {
    const { loadedDepartmentPeriods } = get();
    return Array.from(loadedDepartmentPeriods[departmentSlug] ?? []);
  },

  // 檢查部門在指定日期是否已載入 (根據日期推斷期間)
  isDepartmentDateLoaded: ({ departmentSlug, date }: { departmentSlug: string; date: string }) => {
    const period = dateToPeriod(date);
    const { loadedDepartmentPeriods } = get();
    return loadedDepartmentPeriods[departmentSlug]?.has(period) ?? false;
  },

  // 手動標記部門時期為已載入
  markDepartmentPeriodLoaded: ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => {
    const { loadedDepartmentPeriods } = get();
    const updated = { ...loadedDepartmentPeriods };
    if (!updated[departmentSlug]) {
      updated[departmentSlug] = new Set();
    }
    updated[departmentSlug].add(period);
    set({ loadedDepartmentPeriods: updated });
  },

  // 設定載入狀態
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  // 設定錯誤狀態
  setError: (error: string | null) => set({ error }),

  // 重置所有狀態
  reset: () => {
    set({
      employeesBySlug: {},
      loadedDepartmentPeriods: {},
      isLoading: false,
      error: null,
    });
  },
}));
