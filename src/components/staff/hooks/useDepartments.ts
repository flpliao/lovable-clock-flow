
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';

export const useDepartments = () => {
  const { departments } = useDepartmentManagementContext();

  const getDepartmentNames = () => {
    return departments.map(dept => dept.name);
  };

  const getDepartmentById = (id: string) => {
    return departments.find(dept => dept.id === id);
  };

  const getDepartmentByName = (name: string) => {
    return departments.find(dept => dept.name === name);
  };

  return {
    departments,
    getDepartmentNames,
    getDepartmentById,
    getDepartmentByName
  };
};
