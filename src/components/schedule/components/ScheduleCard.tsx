import { Badge } from '@/components/ui/badge';
import { Schedule } from '@/contexts/scheduling/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, User } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ScheduleCardProps {
  schedule: Schedule;
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  hasConflict: boolean;
  isBeingDragged: boolean;
  onClick: () => void;
  makeDraggable: (element: HTMLElement, scheduleId: string) => () => void;
}

const ScheduleCard = ({
  schedule,
  getUserName,
  getUserRelation,
  hasConflict,
  isBeingDragged,
  onClick,
  makeDraggable,
}: ScheduleCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // 設置拖拽功能
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    return makeDraggable(element, schedule.id);
  }, [makeDraggable, schedule.id]);

  const userName = getUserName(schedule.userId);
  const userRelation = getUserRelation(schedule.userId);

  // 格式化時間，確保只顯示到分鐘
  const formatTime = (time: string) => {
    if (!time) return '';
    // 如果時間包含秒，則移除秒部分
    if (time.includes(':') && time.split(':').length === 3) {
      return time.substring(0, 5); // 只取 HH:MM 部分
    }
    return time;
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'text-xs p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 shadow-md border relative',
        isBeingDragged && 'opacity-50',
        hasConflict
          ? 'bg-red-100/90 border-red-300/60 text-red-800 hover:bg-red-200/90'
          : 'bg-blue-50/95 border-blue-200/70 text-blue-900 hover:bg-blue-100/95 backdrop-blur-md'
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* 員工姓名 */}
        <div className="flex items-center gap-1">
          <User className="h-3 w-3 text-blue-600" />
          <span className="font-bold truncate text-blue-900">{userName}</span>
          {userRelation && (
            <span className="text-blue-600 text-xs font-normal">({userRelation})</span>
          )}
        </div>

        {/* 時間 */}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-700 font-normal">
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </span>
        </div>

        {/* 班別 Badge */}
        {schedule.timeSlot && (
          <Badge
            variant="secondary"
            className="text-xs bg-blue-200 text-blue-800 border-blue-200 hover:bg-blue-200 font-normal"
          >
            {schedule.timeSlot}
          </Badge>
        )}

        {/* 衝突指示 */}
        {hasConflict && (
          <div className="flex items-center gap-1 mt-1">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <span className="text-xs text-red-600 font-medium">時間衝突</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
