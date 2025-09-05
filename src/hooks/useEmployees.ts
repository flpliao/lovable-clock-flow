import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
} from '@/services/employeesService';
import useEmployeesStore from '@/stores/employeesStore';
import { Employee } from '@/types/employee';
import { showError } from '@/utils/toast';

export function useEmployees() {
  const {
    employees,
    isLoading,
    setEmployees,
    addEmployee,
    updateEmployee: updateEmployeeInStore,
    removeEmployee,
    setLoading,
  } = useEmployeesStore();

  const loadEmployees = async () => {
    if (employees.length > 0 || isLoading) return;

    setLoading(true);

    try {
      const employees = await getAllEmployees();
      setEmployees(employees);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (employeeData: Omit<Employee, 'slug'>) => {
    try {
      const newEmployee = await createEmployee(employeeData);
      addEmployee(newEmployee);
      return newEmployee;
    } catch (error) {
      showError(error.message);
    }
  };

  const handleUpdateEmployee = async (
    slug: string,
    employeeData: Partial<Omit<Employee, 'slug'>>
  ) => {
    try {
      const updatedEmployee = await updateEmployee(slug, employeeData);
      updateEmployeeInStore(slug, updatedEmployee);
      return updatedEmployee;
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteEmployee = async (slug: string) => {
    try {
      await deleteEmployee(slug);
      removeEmployee(slug);
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  const getEmployeeBySlug = async (slug: string) => {
    try {
      const employee = await getEmployee(slug);
      return employee;
    } catch (error) {
      showError(error.message);
    }
  };

  const handleChangePassword = async ({
    slug,
    password,
    password_confirmation,
  }: {
    slug: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      // 使用 updateEmployee 來更新密碼
      await updateEmployee(slug, {
        password: password,
        password_confirmation: password_confirmation,
      });
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  return {
    employees,
    isLoading,
    loadEmployees,
    handleCreateEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    handleChangePassword,
    getEmployeeBySlug,
  };
}
