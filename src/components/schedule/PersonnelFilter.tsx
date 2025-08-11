import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { EmployeeWithWorkSchedules } from '@/types/employee';
import { getSelectAllState } from '@/utils/checkboxUtils';
import SelectAllOption from './SelectAllOption';

interface PersonnelFilterState {
  all: boolean;
  [key: string]: boolean; // 動態鍵值，對應每個員工的 slug
}

interface PersonnelFilterProps {
  personnelFilter: PersonnelFilterState;
  onPersonnelFilterChange: (filter: PersonnelFilterState) => void;
  employees: EmployeeWithWorkSchedules[];
}

const PersonnelFilter = ({
  personnelFilter,
  onPersonnelFilterChange,
  employees,
}: PersonnelFilterProps) => {
  // 使用 employees 來計算可見選項
  const visibleOptions = employees.map(employee => personnelFilter[employee.slug] ?? true);
  const selectAllState = getSelectAllState(visibleOptions);

  const handleFilterChange = (key: string, checked: boolean) => {
    if (key === 'all') {
      // 全選邏輯：將所有可見選項設為相同狀態
      const newFilter = { ...personnelFilter, all: checked };
      employees.forEach(employee => {
        newFilter[employee.slug] = checked;
      });
      onPersonnelFilterChange(newFilter);
    } else {
      // 個別選項邏輯
      const newFilter = { ...personnelFilter, [key]: checked };

      // 更新全選狀態
      const newVisibleOptions = employees.map(employee => newFilter[employee.slug] ?? true);
      newFilter.all = newVisibleOptions.every(option => option);

      onPersonnelFilterChange(newFilter);
    }
  };

  return (
    <div>
      <h3 className="text-white font-medium mb-3">人員篩選</h3>
      <div className="flex flex-wrap gap-4">
        <SelectAllOption
          id="personnel-all"
          label="全選"
          checked={selectAllState.checked}
          onCheckedChange={checked => handleFilterChange('all', checked)}
          indeterminate={selectAllState.indeterminate}
        />
        {employees.map(employee => (
          <div key={employee.slug} className="flex items-center space-x-2">
            <Checkbox
              id={employee.slug}
              checked={personnelFilter[employee.slug] ?? true}
              onCheckedChange={checked => handleFilterChange(employee.slug, checked as boolean)}
            />
            <Label htmlFor={employee.slug} className="text-white text-sm cursor-pointer">
              {employee.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonnelFilter;
