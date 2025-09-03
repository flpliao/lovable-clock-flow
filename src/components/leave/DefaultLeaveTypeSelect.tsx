import SearchableSelect from '@/components/ui/SearchableSelect';
import { LeaveTypeCode } from '@/constants/leave';
import useDefaultLeaveTypeStore from '@/stores/defaultLeaveTypeStore';

interface DefaultLeaveTypeSelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  onValueChange?: (value: LeaveTypeCode) => void;
}

/**
 * 預設假別類型選擇器元件
 */
export function DefaultLeaveTypeSelect({
  value,
  onChange,
  placeholder = '選擇假別類型',
  searchPlaceholder = '搜尋假別類型...',
  className,
  disabled = false,
  onValueChange,
}: DefaultLeaveTypeSelectProps) {
  const { defaultLeaveTypes, isLoading } = useDefaultLeaveTypeStore();

  const handleChange = (newValue: string) => {
    onChange(newValue);
    onValueChange?.(newValue as LeaveTypeCode);
  };

  return (
    <SearchableSelect
      className={className}
      options={defaultLeaveTypes.map(type => ({
        value: type.code,
        label: `${type.name} (${type.code})`,
      }))}
      value={value}
      onChange={handleChange}
      placeholder={isLoading ? '載入中...' : placeholder}
      searchPlaceholder={searchPlaceholder}
      disabled={disabled || isLoading}
    />
  );
}
