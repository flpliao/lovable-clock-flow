import { useShift } from '@/hooks/useShift';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface ShiftSelectorProps {
  selectedShift: string | null;
  onShiftSelect: (shiftSlug: string | null) => void;
}

const ShiftSelector = ({ selectedShift, onShiftSelect }: ShiftSelectorProps) => {
  const { shifts } = useShift();

  return (
    <div>
      <h3 className="text-white font-medium mb-3">班次選擇</h3>
      <div className="flex flex-wrap gap-4">
        {shifts.map(shift => {
          const hasWorkSchedules = shift.work_schedules && shift.work_schedules.length > 0;
          const isDisabled = !hasWorkSchedules;

          return (
            <div
              key={shift.slug}
              className={cn(
                'flex items-center space-x-2 px-3 py-2 rounded-lg border-2 transition-all relative group',
                isDisabled
                  ? 'border-gray-500/30 bg-gray-500/10 cursor-not-allowed opacity-50'
                  : selectedShift === shift.slug
                    ? 'border-blue-500 bg-blue-500/20 cursor-pointer'
                    : 'border-white/20 hover:border-white/40 cursor-pointer'
              )}
              onClick={() => !isDisabled && onShiftSelect(shift.slug)}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: shift.color }} />
              <span className="text-white text-sm">{shift.name}</span>

              {/* 禁用提示 */}
              {isDisabled && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>無工作時程</span>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 說明文字 */}
      <div className="mt-3 text-xs text-white/60">
        <p>• 灰色選項表示該班次尚未設定工作時程，無法選擇</p>
        <p>• 請先為班次設定工作時程後才能進行排班</p>
      </div>
    </div>
  );
};

export default ShiftSelector;
