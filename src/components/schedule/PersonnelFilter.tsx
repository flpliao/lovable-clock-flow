import type { Employee } from '@/types/employee';
import { getSelectAllState } from '@/utils/checkboxUtils';
import FilterOption from './FilterOption';
import SelectAllOption from './SelectAllOption';

interface PersonnelFilterState {
  all: boolean;
  [key: string]: boolean; // 動態鍵值，對應每個員工的 slug
}

interface PersonnelFilterProps {
  personnelFilter: PersonnelFilterState;
  onPersonnelFilterChange: (filter: PersonnelFilterState) => void;
  employees: Employee[];
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
          <FilterOption
            key={employee.slug}
            id={employee.slug}
            label={employee.name}
            checked={personnelFilter[employee.slug] ?? true}
            onCheckedChange={checked => handleFilterChange(employee.slug, checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default PersonnelFilter;
