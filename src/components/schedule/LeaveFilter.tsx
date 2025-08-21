import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getSelectAllState } from '@/utils/checkboxUtils';
import SelectAllOption from './SelectAllOption';

interface LeaveFilterState {
  all: boolean;
  leave: boolean;
  monthlyLeave: boolean;
  nationalHoliday: boolean;
  restDay: boolean;
  regularHoliday: boolean;
}

interface LeaveFilterProps {
  leaveFilter: LeaveFilterState;
  onLeaveFilterChange: (filter: LeaveFilterState) => void;
}

const LeaveFilter = ({ leaveFilter, onLeaveFilterChange }: LeaveFilterProps) => {
  // 使用 utils 計算全選狀態
  const visibleOptions = [
    leaveFilter.leave,
    leaveFilter.monthlyLeave,
    leaveFilter.nationalHoliday,
    leaveFilter.restDay,
    leaveFilter.regularHoliday,
  ];
  const selectAllState = getSelectAllState(visibleOptions);

  const handleFilterChange = (key: keyof LeaveFilterState, checked: boolean) => {
    if (key === 'all') {
      // 全選邏輯：將所有可見選項設為相同狀態
      onLeaveFilterChange({
        ...leaveFilter,
        leave: checked,
        monthlyLeave: checked,
        nationalHoliday: checked,
        restDay: checked,
        regularHoliday: checked,
        all: checked,
      });
    } else {
      // 個別選項邏輯
      const newFilter = { ...leaveFilter, [key]: checked };

      // 更新全選狀態
      const newVisibleOptions = [
        newFilter.leave,
        newFilter.monthlyLeave,
        newFilter.nationalHoliday,
        newFilter.restDay,
        newFilter.regularHoliday,
      ];
      newFilter.all = newVisibleOptions.every(option => option);

      onLeaveFilterChange(newFilter);
    }
  };

  return (
    <div>
      <h3 className="text-white font-medium mb-3">休假選擇</h3>
      <div className="flex flex-wrap gap-4">
        <SelectAllOption
          id="leave-all"
          label="全選"
          checked={selectAllState.checked}
          onCheckedChange={checked => handleFilterChange('all', checked)}
          indeterminate={selectAllState.indeterminate}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="leave"
            checked={leaveFilter.leave}
            onCheckedChange={checked => handleFilterChange('leave', checked as boolean)}
          />
          <Label htmlFor="leave" className="text-white text-sm">
            休假
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="monthly-leave"
            checked={leaveFilter.monthlyLeave}
            onCheckedChange={checked => handleFilterChange('monthlyLeave', checked as boolean)}
          />
          <Label htmlFor="monthly-leave" className="text-white text-sm">
            月休
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="national-holiday"
            checked={leaveFilter.nationalHoliday}
            onCheckedChange={checked => handleFilterChange('nationalHoliday', checked as boolean)}
          />
          <Label htmlFor="national-holiday" className="text-white text-sm">
            國定假日
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="rest-day"
            checked={leaveFilter.restDay}
            onCheckedChange={checked => handleFilterChange('restDay', checked as boolean)}
          />
          <Label htmlFor="rest-day" className="text-white text-sm">
            休息日
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="regular-holiday"
            checked={leaveFilter.regularHoliday}
            onCheckedChange={checked => handleFilterChange('regularHoliday', checked as boolean)}
          />
          <Label htmlFor="regular-holiday" className="text-white text-sm">
            例假日
          </Label>
        </div>
      </div>
    </div>
  );
};

export default LeaveFilter;
