import { cn } from '@/lib/utils';

interface ShiftOption {
  id: string;
  name: string;
  color: string;
}

interface ShiftSelectorProps {
  selectedShift: string | null;
  onShiftSelect: (shiftId: string | null) => void;
}

const shiftOptions: ShiftOption[] = [
  { id: '2', name: '診所早班', color: '#10B981' },
  { id: '3', name: '診所晚班', color: '#F59E0B' },
  { id: '4', name: '請假', color: '#EF4444' },
];

const ShiftSelector = ({ selectedShift, onShiftSelect }: ShiftSelectorProps) => {
  return (
    <div>
      <h3 className="text-white font-medium mb-3">班次選擇</h3>
      <div className="flex flex-wrap gap-4">
        {shiftOptions.map(shift => (
          <div
            key={shift.id}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all',
              selectedShift === shift.id
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-white/20 hover:border-white/40'
            )}
            onClick={() => onShiftSelect(selectedShift === shift.id ? null : shift.id)}
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
