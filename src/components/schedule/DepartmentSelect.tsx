import SearchableSelect from '@/components/ui/SearchableSelect';
import { useDepartmentStore } from '@/stores/departmentStore';

interface DepartmentSelectProps {
  selectedDepartment: string;
  onDepartmentChange: (value: string) => void;
}

const DepartmentSelect = ({ selectedDepartment, onDepartmentChange }: DepartmentSelectProps) => {
  const departments = useDepartmentStore(state => state.departments);

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-2">單位</label>
      <SearchableSelect
        className="w-full bg-white/10 border-white/20 text-white rounded-md"
        options={departments.map(department => ({
          value: department.slug,
          label: department.name,
        }))}
        value={selectedDepartment}
        onChange={onDepartmentChange}
        placeholder="請選擇單位"
        searchPlaceholder="搜尋單位..."
      />
    </div>
  );
};

export default DepartmentSelect;
