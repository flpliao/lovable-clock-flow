import SearchableSelect from '@/components/ui/SearchableSelect';
import { useEmployees } from '@/hooks/useEmployees';
import { cn } from '@/lib/utils';
import useEmployeesStore from '@/stores/employeesStore';
import { Employee } from '@/types/employee';
import { useEffect } from 'react';

interface EmployeeSelectProps {
  selectedEmployee: string;
  onEmployeeChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  excludeRoles?: string[]; // 排除的角色名稱列表
  includeRoles?: string[]; // 只包含的角色名稱列表
  excludeEmployeeSlug?: string; // 排除特定員工（通常是自己）
  customFilter?: (employee: Employee) => boolean; // 自定義過濾函數
}

const EmployeeSelect = ({
  selectedEmployee,
  onEmployeeChange,
  className,
  placeholder = '請選擇員工',
  searchPlaceholder = '搜尋員工...',
  excludeRoles = [],
  includeRoles = [],
  excludeEmployeeSlug,
}: EmployeeSelectProps) => {
  const employees = useEmployeesStore(state => state.employees);
  const { loadEmployees } = useEmployees();

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // 根據角色過濾員工
  const filteredEmployees = employees.filter(employee => {
    // 排除特定員工（通常是自己）
    if (excludeEmployeeSlug && employee.slug === excludeEmployeeSlug) {
      return false;
    }

    const employeeRoles = employee.roles?.map(role => role.name) || [];

    // 如果有指定排除角色，則排除這些角色的員工
    if (excludeRoles.length > 0) {
      const hasExcludedRole = excludeRoles.some(role => employeeRoles.includes(role));
      if (hasExcludedRole) return false;
    }

    // 如果有指定包含角色，則只包含這些角色的員工
    if (includeRoles.length > 0) {
      const hasIncludedRole = includeRoles.some(role => employeeRoles.includes(role));
      if (!hasIncludedRole) return false;
    }

    return true;
  });

  return (
    <SearchableSelect
      className={cn('w-full', className)}
      options={filteredEmployees.map(employee => ({
        value: employee.slug,
        label: employee.name,
      }))}
      value={selectedEmployee}
      onChange={onEmployeeChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
    />
  );
};

export default EmployeeSelect;
