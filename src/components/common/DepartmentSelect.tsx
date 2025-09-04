import SearchableSelect from '@/components/ui/SearchableSelect';
import { useDepartment } from '@/hooks/useDepartment';
import { cn } from '@/lib/utils';
import { useDepartmentStore } from '@/stores/departmentStore';
import { useEffect } from 'react';

interface DepartmentSelectProps {
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
  className?: string;
}

const DepartmentSelect = ({
  selectedDepartment,
  onDepartmentChange,
  className,
}: DepartmentSelectProps) => {
  const departments = useDepartmentStore(state => state.departments);
  const { loadDepartments } = useDepartment();

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <SearchableSelect
      className={cn('w-full', className)}
      options={departments.map(department => ({
        value: department.slug,
        label: department.name,
      }))}
      value={selectedDepartment}
      onChange={onDepartmentChange}
      placeholder="請選擇單位"
      searchPlaceholder="搜尋單位..."
    />
  );
};

export default DepartmentSelect;
