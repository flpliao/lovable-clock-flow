import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ShiftOptionProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showColor?: boolean;
  color?: string;
}

const ShiftOption = ({
  id,
  label,
  checked,
  onCheckedChange,
  showColor = false,
  color,
}: ShiftOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={checked => onCheckedChange(checked as boolean)}
      />
      {showColor && color && (
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      )}
      <Label htmlFor={id} className="text-white text-sm">
        {label}
      </Label>
    </div>
  );
};

export default ShiftOption;
