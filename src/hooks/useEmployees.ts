import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  getEmployees,
  updateEmployee,
} from '@/services/employeesService';
import { useEmployeesStore } from '@/stores/employeesStore';
import { Employee } from '@/types/employee';

export const useEmployees = () => {
  const {
    employeesBySlug,
    loadedDepartments,
    isLoading,
    error,
    setEmployees,
    addEmployeesForDepartment,
    addEmployee,
    setEmployee,
    removeEmployee,
    getEmployeesByDepartment,
    getAllEmployees: getAllEmployeesFromStore,
    isDepartmentLoaded,
    getEmployeeBySlug,
    setIsLoading,
    setError,
    clearDepartmentEmployees,
    reset,
  } = useEmployeesStore();

  // 載入所有員工
  const loadAllEmployees = async () => {
    setIsLoading(true);
    setError(null);

    const data = await getAllEmployees();
    setEmployees(data);

    // 標記所有部門為已載入
    const departmentSlugs = new Set(data.map(emp => emp.department?.slug || 'unknown'));
    departmentSlugs.forEach(departmentSlug => {
      if (!isDepartmentLoaded(departmentSlug)) {
        const deptEmployees = data.filter(emp => emp.department?.slug === departmentSlug);
        addEmployeesForDepartment(departmentSlug, deptEmployees);
      }
    });

    setIsLoading(false);
    return data;
  };

  // 載入員工列表（分頁，支援部門篩選）
  const loadEmployees = async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    department_slug?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    const data = await getEmployees(params);

    // 將員工按部門分組並儲存
    const employeesByDepartment = new Map<string, Employee[]>();

    data.forEach(employee => {
      const departmentSlug = employee.department?.slug || 'unknown';
      if (!employeesByDepartment.has(departmentSlug)) {
        employeesByDepartment.set(departmentSlug, []);
      }
      employeesByDepartment.get(departmentSlug)!.push(employee);
    });

    employeesByDepartment.forEach((employees, departmentSlug) => {
      addEmployeesForDepartment(departmentSlug, employees);
    });

    setIsLoading(false);
    return data;
  };

  // 載入特定部門的員工
  const loadEmployeesByDepartment = async (departmentSlug: string) => {
    // 檢查是否已載入或正在載入
    if (isLoading || isDepartmentLoaded(departmentSlug)) {
      return getEmployeesByDepartment(departmentSlug);
    }

    setIsLoading(true);
    setError(null);

    const data = await getEmployees({ department_slug: departmentSlug });
    addEmployeesForDepartment(departmentSlug, data);

    setIsLoading(false);
    return data;
  };

  // 載入單一員工
  const loadEmployee = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    const data = await getEmployee(slug);
    if (data) {
      addEmployee(data);
    }
    setIsLoading(false);
    return data;
  };

  // 建立員工
  const handleCreateEmployee = async (employeeData: Omit<Employee, 'slug'>) => {
    setIsLoading(true);
    setError(null);

    const newEmployee = await createEmployee(employeeData);
    if (newEmployee) {
      addEmployee(newEmployee);
    }

    setIsLoading(false);
    return newEmployee;
  };

  // 更新員工
  const handleUpdateEmployee = async (
    slug: string,
    employeeData: Partial<Omit<Employee, 'slug'>>
  ) => {
    setIsLoading(true);
    setError(null);

    const updatedEmployee = await updateEmployee(slug, employeeData);
    if (updatedEmployee) {
      setEmployee(slug, updatedEmployee);
    }

    setIsLoading(false);
    return updatedEmployee;
  };

  // 刪除員工
  const handleDeleteEmployee = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    const success = await deleteEmployee(slug);
    if (success) {
      removeEmployee(slug);
    }

    setIsLoading(false);
    return success;
  };

  return {
    // 狀態
    employeesBySlug,
    isLoading,
    error,
    loadedDepartments,

    // 查詢方法
    getEmployeesByDepartment,
    getAllEmployees: getAllEmployeesFromStore,
    isDepartmentLoaded,
    getEmployeeBySlug,

    // 操作方法
    loadAllEmployees,
    loadEmployees,
    loadEmployeesByDepartment,
    loadEmployee,
    handleCreateEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,

    // 狀態管理
    clearDepartmentEmployees,
    reset,
  };
};
