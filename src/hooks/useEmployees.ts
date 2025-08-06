import {
  createEmployee as createEmployeeService,
  deleteEmployee as deleteEmployeeService,
  getAllEmployees,
  getEmployee,
  getEmployees,
  updateEmployee as updateEmployeeService,
} from '@/services/employeesService';
import { useEmployeesStore } from '@/stores/employeesStore';
import { Employee } from '@/types/employee';

export const useEmployees = () => {
  const {
    employees,
    isLoading,
    error,
    setEmployees,
    addEmployee,
    setEmployee,
    removeEmployee,
    setIsLoading,
    setError,
  } = useEmployeesStore();

  // 載入所有員工
  const loadAllEmployees = async () => {
    if (isLoading || employees.length > 0) return;

    setIsLoading(true);
    setError(null);

    const data = await getAllEmployees();
    setEmployees(data);
    setIsLoading(false);
    return data;
  };

  // 載入員工列表（分頁）
  const loadEmployees = async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    department?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    const data = await getEmployees(params);
    setEmployees(data);
    setIsLoading(false);
    return data;
  };

  // 載入單一員工
  const loadEmployee = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    const data = await getEmployee(slug);
    setIsLoading(false);
    return data;
  };

  // 建立員工
  const handleCreateEmployee = async (employeeData: Omit<Employee, 'slug'>) => {
    setIsLoading(true);
    setError(null);

    const newEmployee = await createEmployeeService(employeeData);
    if (newEmployee) {
      addEmployee(newEmployee);
      setIsLoading(false);
      return newEmployee;
    } else {
      setError('建立員工失敗');
      setIsLoading(false);
    }
  };

  // 更新員工
  const handleUpdateEmployee = async (
    slug: string,
    employeeData: Partial<Omit<Employee, 'slug'>>
  ) => {
    setIsLoading(true);
    setError(null);

    const updatedEmployee = await updateEmployeeService(slug, employeeData);
    if (updatedEmployee) {
      setEmployee(slug, updatedEmployee);
      setIsLoading(false);
      return updatedEmployee;
    } else {
      setError('更新員工失敗');
      setIsLoading(false);
    }
  };

  // 刪除員工
  const handleDeleteEmployee = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    const success = await deleteEmployeeService(slug);
    if (success) {
      removeEmployee(slug);
      setIsLoading(false);
      return success;
    } else {
      setError('刪除員工失敗');
      setIsLoading(false);
    }
  };

  return {
    // 狀態
    employees,
    isLoading,
    error,

    // 員工操作方法
    loadAllEmployees,
    loadEmployees,
    loadEmployee,
    handleCreateEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
  };
};
