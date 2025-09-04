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

  return {
    employees,
    isLoading,
    loadEmployees,
    handleCreateEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    getEmployeeBySlug,
  };
}
