import { Employee } from '@/types/employee';
import { create } from 'zustand';

interface EmployeesState {
  // 員工資料字典：slug -> Employee
  employeesBySlug: Record<string, Employee>;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // 已載入的部門記錄
  loadedDepartments: string[];

  // 基本操作方法
  setEmployees: (employees: Employee[]) => void;
  addEmployeesForDepartment: (departmentSlug: string, employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  setEmployee: (slug: string, employeeData: Partial<Employee>) => void;
  removeEmployee: (slug: string) => void;

  // 查詢方法
  getEmployeesByDepartment: (departmentSlug: string) => Employee[];
  getAllEmployees: () => Employee[];
  getEmployeeBySlug: (slug: string) => Employee | undefined;
  isDepartmentLoaded: (departmentSlug: string) => boolean;

  // 狀態管理
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearDepartmentEmployees: (departmentSlug?: string) => void;
  reset: () => void;
}

export const useEmployeesStore = create<EmployeesState>()((set, get) => ({
  employeesBySlug: {},
  isLoading: false,
  error: null,
  loadedDepartments: [],

  // 設定員工資料（全部替換）
  setEmployees: (employees: Employee[]) => {
    const employeesBySlug: Record<string, Employee> = {};
    for (const emp of employees) {
      employeesBySlug[emp.slug] = emp;
    }
    set({ employeesBySlug, error: null });
  },

  // 為特定部門新增員工（更新或新增）
  addEmployeesForDepartment: (departmentSlug: string, employees: Employee[]) => {
    const { employeesBySlug, loadedDepartments } = get();
    const updatedEmployeesBySlug = { ...employeesBySlug };
    const updatedLoadedDepartments = [...loadedDepartments];

    // 更新員工資料
    for (const emp of employees) {
      updatedEmployeesBySlug[emp.slug] = emp;
    }

    // 標記部門為已載入（如果還沒有的話）
    if (!updatedLoadedDepartments.includes(departmentSlug)) {
      updatedLoadedDepartments.push(departmentSlug);
    }

    set({
      employeesBySlug: updatedEmployeesBySlug,
      loadedDepartments: updatedLoadedDepartments,
      error: null,
    });
  },

  // 新增單一員工
  addEmployee: (employee: Employee) => {
    const { employeesBySlug } = get();
    set({
      employeesBySlug: { ...employeesBySlug, [employee.slug]: employee },
      error: null,
    });
  },

  // 更新員工資料
  setEmployee: (slug: string, employeeData: Partial<Employee>) => {
    const { employeesBySlug } = get();
    const existingEmployee = employeesBySlug[slug];
    if (existingEmployee) {
      set({
        employeesBySlug: {
          ...employeesBySlug,
          [slug]: { ...existingEmployee, ...employeeData },
        },
        error: null,
      });
    }
  },

  // 移除員工
  removeEmployee: (slug: string) => {
    const { employeesBySlug } = get();
    const { [slug]: _removed, ...remainingEmployees } = employeesBySlug;
    set({ employeesBySlug: remainingEmployees, error: null });
  },

  // 取得部門的員工列表
  getEmployeesByDepartment: (departmentSlug: string) => {
    const { employeesBySlug } = get();
    return Object.values(employeesBySlug).filter(emp => emp.department?.slug === departmentSlug);
  },

  // 取得所有員工
  getAllEmployees: () => {
    const { employeesBySlug } = get();
    return Object.values(employeesBySlug);
  },

  // 根據 slug 取得員工
  getEmployeeBySlug: (slug: string) => {
    const { employeesBySlug } = get();
    return employeesBySlug[slug];
  },

  // 檢查部門是否已載入
  isDepartmentLoaded: (departmentSlug: string) => {
    const { loadedDepartments } = get();
    return loadedDepartments.includes(departmentSlug);
  },

  // 設定載入狀態
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  // 設定錯誤狀態
  setError: (error: string | null) => set({ error }),

  // 清除特定部門或所有部門的員工資料
  clearDepartmentEmployees: (departmentSlug?: string) => {
    const { employeesBySlug, loadedDepartments } = get();
    const updatedLoadedDepartments = loadedDepartments.filter(d => d !== departmentSlug);

    if (departmentSlug) {
      // 清除特定部門的員工
      const remainingEmployees: Record<string, Employee> = {};
      Object.values(employeesBySlug).forEach(emp => {
        if (emp.department?.slug !== departmentSlug) {
          remainingEmployees[emp.slug] = emp;
        }
      });
      set({
        employeesBySlug: remainingEmployees,
        loadedDepartments: updatedLoadedDepartments,
      });
    } else {
      // 清除所有員工
      set({
        employeesBySlug: {},
        loadedDepartments: [],
      });
    }
  },

  // 重置所有狀態
  reset: () => {
    set({
      employeesBySlug: {},
      loadedDepartments: [],
      isLoading: false,
      error: null,
    });
  },
}));
