import { Eye } from 'lucide-react';
import ViewModeSelector from './ViewModeSelector';

interface ScheduleHeaderProps {
  viewMode: 'self' | 'subordinates' | 'all';
  onViewModeChange: (value: 'self' | 'subordinates' | 'all') => void;
  hasSubordinates: boolean;
}

const ScheduleHeader = ({ viewMode, onViewModeChange, hasSubordinates }: ScheduleHeaderProps) => {
  return (
    <div className="space-y-8">
      {/* 查看模式選擇 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Eye className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">查看範圍</h3>
        </div>
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          hasSubordinates={hasSubordinates}
        />
      </div>
    </div>
  );
};

export default ScheduleHeader;
