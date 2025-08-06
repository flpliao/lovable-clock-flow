import { useShift } from '@/hooks/useShift';
import { cn } from '@/lib/utils';
import { Shift } from '@/types/shift';

interface ShiftSelectorProps {
  selectedShift: string | null;
  onShiftSelect: (shift: Shift | null) => void;
}

const ShiftSelector = ({ selectedShift, onShiftSelect }: ShiftSelectorProps) => {
  const { shifts } = useShift();

  return (
    <div>
      <h3 className="text-white font-medium mb-3">班次選擇</h3>
      <div className="flex flex-wrap gap-4">
        {shifts.map(shift => (
          <div
            key={shift.id}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all',
              selectedShift === shift.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-white/20 hover:border-white/40'
            )}
            onClick={() => onShiftSelect(shift)}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shift.color }} />
            <span className="text-white text-sm">{shift.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiftSelector;
