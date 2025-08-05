import SelectAllOption from './SelectAllOption';
import ShiftOption from './ShiftOption';

interface ShiftFilterState {
  all: boolean;
  support: boolean;
  requestLeave: boolean;
  clinicMorning: boolean;
  clinicEvening: boolean;
}

interface ShiftFilterProps {
  shiftFilter: ShiftFilterState;
  onShiftFilterChange: (filter: ShiftFilterState) => void;
}

const ShiftFilter = ({ shiftFilter, onShiftFilterChange }: ShiftFilterProps) => {
  // 計算全選狀態
  const getSelectAllState = () => {
    const visibleOptions = [shiftFilter.clinicMorning, shiftFilter.clinicEvening];
    const allChecked = visibleOptions.every(option => option);
    const someChecked = visibleOptions.some(option => option);

    if (allChecked) return { checked: true, indeterminate: false };
    if (someChecked) return { checked: false, indeterminate: true };
    return { checked: false, indeterminate: false };
  };

  const handleFilterChange = (key: keyof ShiftFilterState, checked: boolean) => {
    if (key === 'all') {
      // 全選邏輯：將所有可見選項設為相同狀態
      onShiftFilterChange({
        ...shiftFilter,
        clinicMorning: checked,
        clinicEvening: checked,
        all: checked,
      });
    } else {
      // 個別選項邏輯
      const newFilter = { ...shiftFilter, [key]: checked };

      // 更新全選狀態
      const visibleOptions = [newFilter.clinicMorning, newFilter.clinicEvening];
      newFilter.all = visibleOptions.every(option => option);

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
          checked={getSelectAllState().checked}
          onCheckedChange={checked => handleFilterChange('all', checked)}
          indeterminate={getSelectAllState().indeterminate}
        />
        {/* <ShiftOption
          id="support"
          label="支援"
          checked={shiftFilter.support}
          onCheckedChange={checked => handleFilterChange('support', checked)}
        /> */}
        {/* <ShiftOption
          id="request-leave"
          label="請假"
          checked={shiftFilter.requestLeave}
          onCheckedChange={checked => handleFilterChange('requestLeave', checked)}
        /> */}
        <ShiftOption
          id="clinic-morning"
          label="診所早班"
          checked={shiftFilter.clinicMorning}
          onCheckedChange={checked => handleFilterChange('clinicMorning', checked)}
          showColor={true}
          color="#10B981"
        />
        <ShiftOption
          id="clinic-evening"
          label="診所晚班"
          checked={shiftFilter.clinicEvening}
          onCheckedChange={checked => handleFilterChange('clinicEvening', checked)}
          showColor={true}
          color="#F59E0B"
        />
      </div>
    </div>
  );
};

export default ShiftFilter;
