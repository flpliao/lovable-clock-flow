import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showColor?: boolean;
  color?: string;
}

const FilterOption = ({
  id,
  label,
  checked,
  onCheckedChange,
  showColor = false,
  color,
}: FilterOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={checked => onCheckedChange(checked as boolean)}
      />
      <Label htmlFor={id} className="text-white text-sm cursor-pointer flex items-center gap-1">
        {showColor && color && (
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        )}
        {label}
      </Label>
    </div>
  );
};

export default FilterOption;
