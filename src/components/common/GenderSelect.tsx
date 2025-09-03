import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gender } from '@/constants/gender';

interface GenderSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const GenderSelect = ({
  value,
  onValueChange,
  placeholder = '選擇性別',
  className,
  disabled = false,
}: GenderSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Gender.MALE}>男性</SelectItem>
        <SelectItem value={Gender.FEMALE}>女性</SelectItem>
        <SelectItem value={Gender.OTHER}>其他</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GenderSelect;
