import { useShift } from '@/hooks/useShift';
import { getSelectAllState } from '@/utils/checkboxUtils';
import SelectAllOption from './SelectAllOption';
import ShiftOption from './ShiftOption';

interface ShiftFilterState {
  all: boolean;
  [key: string]: boolean; // 動態鍵值，對應每個 shift 的 slug
}

interface ShiftFilterProps {
  shiftFilter: ShiftFilterState;
  onShiftFilterChange: (filter: ShiftFilterState) => void;
}

const ShiftFilter = ({ shiftFilter, onShiftFilterChange }: ShiftFilterProps) => {
  const { shifts } = useShift();

  // 使用 shifts 來計算可見選項
  const visibleOptions = shifts.map(shift => shiftFilter[shift.slug] ?? true);
  const selectAllState = getSelectAllState(visibleOptions);

  const handleFilterChange = (key: string, checked: boolean) => {
    if (key === 'all') {
      // 全選邏輯：將所有可見選項設為相同狀態
      const newFilter = { ...shiftFilter, all: checked };
      shifts.forEach(shift => {
        newFilter[shift.slug] = checked;
      });
      onShiftFilterChange(newFilter);
    } else {
      // 個別選項邏輯
      const newFilter = { ...shiftFilter, [key]: checked };

      // 更新全選狀態
      const newVisibleOptions = shifts.map(shift => newFilter[shift.slug] ?? true);
      newFilter.all = newVisibleOptions.every(option => option);

      onShiftFilterChange(newFilter);
    }
  };

  return (
    <div>
      <h3 className="text-white font-medium mb-3">班次選擇</h3>
      <div className="flex flex-wrap gap-4">
        <SelectAllOption
          id="shift-all"
          label="全選"
          checked={selectAllState.checked}
          onCheckedChange={checked => handleFilterChange('all', checked)}
          indeterminate={selectAllState.indeterminate}
        />
        {shifts.map(shift => (
          <ShiftOption
            key={shift.slug}
            id={shift.slug}
            label={shift.name}
            checked={shiftFilter[shift.slug] ?? true}
            onCheckedChange={checked => handleFilterChange(shift.slug, checked)}
            showColor={true}
            color={shift.color}
          />
        ))}
      </div>
    </div>
  );
};

export default ShiftFilter;
