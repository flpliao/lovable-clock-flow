import type { Employee, EmployeesBySlug } from '@/types/employee';
import type { WorkSchedule } from '@/types/workSchedule';
import { dateToPeriod } from '@/utils/dateUtils';
import dayjs from 'dayjs';
import { create } from 'zustand';
interface EmployeeWorkScheduleState {
  employeesBySlug: EmployeesBySlug;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // 記錄員工的實際載入範圍 (employeeSlug -> { startDate, endDate }[])
  loadedEmployeeRanges: Record<string, { startDate: string; endDate: string }[]>;

  // 基本操作方法
  setEmployees: (employees: Employee[]) => void;
  addEmployeesForDepartment: ({
    employees,
    startDate,
    endDate,
  }: {
    employees: Employee[];
    startDate?: string;
    endDate?: string;
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
  getEmployeesByDepartment: (departmentSlug: string) => Employee[];
  getEmployeeBySlug: (slug: string) => Employee;
  getEmployeeWorkSchedule: ({
    employeeSlug,
    date,
  }: {
    employeeSlug: string;
    date: string;
  }) => WorkSchedule | undefined;
  getEmployeeWorkSchedules: (employeeSlug: string) => WorkSchedule[];
  getEmployeeWorkSchedulesByDate: (date: string) => WorkSchedule[];
  isDepartmentDateLoaded: ({
    departmentSlug,
    date,
  }: {
    departmentSlug: string;
    date: string;
  }) => boolean;
  isDepartmentPeriodLoaded: ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => boolean;
  getLoadedPeriodsForDepartment: (departmentSlug: string) => string[];
  isEmployeeDateRangeLoaded: ({
    employeeSlug,
    startDate,
    endDate,
  }: {
    employeeSlug: string;
    startDate: string;
    endDate: string;
  }) => boolean;
  getEmployeeLoadedRanges: (employeeSlug: string) => { startDate: string; endDate: string }[];

  // 狀態管理
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEmployeeWorkScheduleStore = create<EmployeeWorkScheduleState>()((set, get) => ({
  employeesBySlug: {},
  isLoading: false,
  error: null,
  loadedEmployeeRanges: {},

  // 設定員工資料（全部替換）
  setEmployees: (employees: Employee[]) => {
    const employeesBySlug: EmployeesBySlug = {};

    for (const emp of employees) {
      employeesBySlug[emp.slug] = {
        ...emp,
        work_schedules: emp.work_schedules || [],
      };
    }

    set({ employeesBySlug, error: null });
  },

  // 為特定部門新增員工（更新或新增）
  addEmployeesForDepartment: ({
    employees,
    startDate,
    endDate,
  }: {
    employees: Employee[];
    startDate?: string;
    endDate?: string;
  }) => {
    const { employeesBySlug, loadedEmployeeRanges } = get();
    const updatedEmployeesBySlug = { ...employeesBySlug };
    const updatedLoadedEmployeeRanges = { ...loadedEmployeeRanges };

    // 更新員工資料 - 合併而不是覆蓋
    for (const emp of employees) {
      const existingEmployee = updatedEmployeesBySlug[emp.slug];

      if (existingEmployee) {
        // 如果員工已存在，合併 work_schedules
        const existingSchedules = existingEmployee.work_schedules || [];
        const newSchedules = emp.work_schedules || [];

        // 合併排程，避免重複日期
        const mergedSchedules = [...existingSchedules];
        newSchedules.forEach(newSchedule => {
          const existingIndex = mergedSchedules.findIndex(
            existing => existing.pivot?.date === newSchedule.pivot?.date
          );

          if (existingIndex !== -1) {
            // 如果日期已存在，更新排程
            mergedSchedules[existingIndex] = newSchedule;
          } else {
            // 如果日期不存在，新增排程
            mergedSchedules.push(newSchedule);
          }
        });

        updatedEmployeesBySlug[emp.slug] = {
          ...existingEmployee,
          work_schedules: mergedSchedules,
        };
      } else {
        // 如果員工不存在，直接新增
        updatedEmployeesBySlug[emp.slug] = {
          ...emp,
          work_schedules: emp.work_schedules || [],
        };
      }
    }

    // 記錄每個員工的實際載入日期範圍
    if (startDate && endDate) {
      employees.forEach(emp => {
        if (!updatedLoadedEmployeeRanges[emp.slug]) {
          updatedLoadedEmployeeRanges[emp.slug] = [];
        }

        // 檢查是否已存在相同的範圍，避免重複
        const existingRange = updatedLoadedEmployeeRanges[emp.slug].find(
          range => range.startDate === startDate && range.endDate === endDate
        );

        if (!existingRange) {
          updatedLoadedEmployeeRanges[emp.slug].push({ startDate, endDate });
        }
      });
    }

    set({
      employeesBySlug: updatedEmployeesBySlug,
      loadedEmployeeRanges: updatedLoadedEmployeeRanges,
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
  getEmployeesByDepartment: (departmentSlug: string): Employee[] => {
    const { employeesBySlug } = get();
    const employeesByDepartment: Employee[] = [];

    Object.values(employeesBySlug).forEach(emp => {
      if (emp.department?.slug === departmentSlug) {
        employeesByDepartment.push(emp);
      }
    });

    return employeesByDepartment;
  },

  // 根據 slug 取得員工
  getEmployeeBySlug: (slug: string): Employee => {
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

  // 檢查部門的特定時期是否已載入（基於員工範圍）
  isDepartmentPeriodLoaded: ({
    departmentSlug,
    period,
  }: {
    departmentSlug: string;
    period: string;
  }) => {
    // 檢查該部門的所有員工是否都已載入該時期
    const employees = get().getEmployeesByDepartment(departmentSlug);
    if (employees.length === 0) return false;

    const startDate = period + '-01';
    const endDate = dayjs(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

    // 檢查所有員工是否都已載入該時期
    return employees.every(emp => {
      const employeeRanges = get().loadedEmployeeRanges[emp.slug] || [];
      return employeeRanges.some(range => startDate >= range.startDate && endDate <= range.endDate);
    });
  },

  // 取得部門已載入的時期列表（基於員工範圍）
  getLoadedPeriodsForDepartment: (departmentSlug: string) => {
    const employees = get().getEmployeesByDepartment(departmentSlug);
    const allPeriods = new Set<string>();

    employees.forEach(emp => {
      const employeeRanges = get().loadedEmployeeRanges[emp.slug] || [];
      employeeRanges.forEach(range => {
        // 計算範圍內的所有月份
        const startDate = dayjs(range.startDate);
        const endDate = dayjs(range.endDate);

        let currentDate = startDate.startOf('month');
        const endMonth = endDate.startOf('month');

        while (currentDate.isSameOrBefore(endMonth)) {
          const period = currentDate.format('YYYY-MM');
          allPeriods.add(period);
          currentDate = currentDate.add(1, 'month');
        }
      });
    });

    return Array.from(allPeriods);
  },

  // 檢查部門在指定日期是否已載入 (根據日期推斷期間)
  isDepartmentDateLoaded: ({ departmentSlug, date }: { departmentSlug: string; date: string }) => {
    // 檢查該部門的所有員工是否都已載入該日期
    const employees = get().getEmployeesByDepartment(departmentSlug);
    if (employees.length === 0) return false;

    const period = dateToPeriod(date);
    const startDate = period + '-01';
    const endDate = dayjs(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD');

    // 檢查所有員工是否都已載入該時期
    return employees.every(emp => {
      const employeeRanges = get().loadedEmployeeRanges[emp.slug] || [];
      return employeeRanges.some(range => startDate >= range.startDate && endDate <= range.endDate);
    });
  },

  // 檢查員工的特定日期範圍是否已載入
  isEmployeeDateRangeLoaded: ({
    employeeSlug,
    startDate,
    endDate,
  }: {
    employeeSlug: string;
    startDate: string;
    endDate: string;
  }) => {
    const { loadedEmployeeRanges } = get();
    const loadedRanges = loadedEmployeeRanges[employeeSlug];

    if (!loadedRanges || loadedRanges.length === 0) return false;

    // 檢查請求的範圍是否完全包含在任何一個已載入的範圍內
    return loadedRanges.some(range => startDate >= range.startDate && endDate <= range.endDate);
  },

  // 取得員工已載入的日期範圍列表
  getEmployeeLoadedRanges: (employeeSlug: string) => {
    const { loadedEmployeeRanges } = get();
    return loadedEmployeeRanges[employeeSlug] || [];
  },

  // 設定載入狀態
  setLoading: (isLoading: boolean) => set({ isLoading }),

  // 設定錯誤狀態
  setError: (error: string | null) => set({ error }),

  // 重置所有狀態
  reset: () => {
    set({
      employeesBySlug: {},
      loadedEmployeeRanges: {},
      isLoading: false,
      error: null,
    });
  },
}));
