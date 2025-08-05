import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface SelectAllOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  indeterminate?: boolean;
}

const SelectAllOption = ({
  id,
  label,
  checked,
  onCheckedChange,
  indeterminate = false,
}: SelectAllOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative inline-flex">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={checked => onCheckedChange(checked as boolean)}
          className={cn(indeterminate && 'bg-blue-500 border-blue-500')}
        />
        {indeterminate && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-2 h-0.5 bg-white rounded-sm"></div>
          </div>
        )}
      </div>
      <Label htmlFor={id} className="text-white text-sm">
        {label}
      </Label>
    </div>
  );
};

export default SelectAllOption;
