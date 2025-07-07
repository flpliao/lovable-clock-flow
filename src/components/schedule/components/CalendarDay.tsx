import { Schedule } from '@/contexts/scheduling/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';
import ScheduleCard from './ScheduleCard';

interface CalendarDayData {
  date: Date;
  label: string;
  lunarDay: string;
  isWeekend: boolean;
  isCurrentMonth: boolean;
  isExtended: boolean;
  isPreviousMonth: boolean;
  isNextMonth: boolean;
}

interface CalendarDayProps {
  day: CalendarDayData;
  schedules: Schedule[];
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  getScheduleConflicts: (schedule: Schedule) => Schedule[];
  onScheduleClick: (schedule: Schedule) => void;
  onShowAllSchedules: (date: Date, schedules: Schedule[]) => void;
  isExtendedMonth?: boolean;
  makeDropTarget: (element: HTMLElement, date: Date) => () => void;
  makeDraggable: (element: HTMLElement, scheduleId: string) => () => void;
  isDragging: boolean;
  draggedScheduleId: string | null;
}

const CalendarDay = ({
  day,
  schedules,
  getUserName,
  getUserRelation,
  getScheduleConflicts,
  onScheduleClick,
  onShowAllSchedules,
  isExtendedMonth,
  makeDropTarget,
  makeDraggable,
  isDragging,
  draggedScheduleId,
}: CalendarDayProps) => {
  const dayRef = useRef<HTMLDivElement>(null);

  // 設置放置目標
  useEffect(() => {
    const element = dayRef.current;
    if (!element || !day?.date) return;

    return makeDropTarget(element, day.date);
  }, [makeDropTarget, day?.date]);

  if (!day?.date) {
    return (
      <div className="min-h-[120px] border-r border-white/8 last:border-r-0 border-b border-white/8" />
    );
  }

  const daySchedules = schedules.filter(
    schedule => schedule.workDate === format(day.date!, 'yyyy-MM-dd')
  );

  const isToday = format(day.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6;
  const isCurrentMonth = day.isCurrentMonth;

  // 判斷是否應該顯示拖曳提示
  const shouldShowDropHint = isDragging && daySchedules.length === 0;

  return (
    <div
      ref={dayRef}
      className={cn(
        'min-h-[120px] p-3 border-r border-white/8 last:border-r-0 border-b border-white/8 cursor-pointer transition-all duration-300 relative',
        isExtendedMonth ? 'bg-white/2' : '',
        isToday && !isExtendedMonth && 'bg-gradient-to-br from-blue-300/20 to-blue-200/10',
        isDragging && 'bg-gradient-to-br from-green-200/25 to-green-100/15',
        !isDragging && 'hover:bg-white/5'
      )}
    >
      <div className="flex flex-col h-full">
        {/* 日期標題 */}
        <div
          className={cn(
            'text-sm mb-2 font-semibold',
            isCurrentMonth ? (isWeekend ? 'text-red-400' : 'text-gray-700') : 'text-gray-500',
            isToday && 'text-blue-600'
          )}
        >
          {day.date.getDate()}
        </div>

        {/* 農曆日期 */}
        {day.lunarDay && (
          <div className={cn('text-xs mb-2', isCurrentMonth ? 'text-gray-500' : 'text-gray-400')}>
            {day.lunarDay}
          </div>
        )}

        {/* 排班卡片 */}
        <div className="flex-1 space-y-2 relative">
          {daySchedules.slice(0, 3).map(schedule => {
            const conflicts = getScheduleConflicts(schedule);
            const isBeingDragged = draggedScheduleId === schedule.id;

            return (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                getUserName={getUserName}
                getUserRelation={getUserRelation}
                hasConflict={conflicts.length > 0}
                isBeingDragged={isBeingDragged}
                onClick={() => onScheduleClick(schedule)}
                makeDraggable={makeDraggable}
              />
            );
          })}

          {/* 顯示更多按鈕 */}
          {daySchedules.length > 3 && (
            <div
              className="text-xs text-gray-600 bg-white/80 backdrop-blur-md border border-white/40 px-3 py-2 rounded-lg text-center cursor-pointer hover:bg-white/90 transition-all duration-200 shadow-md"
              onClick={() => onShowAllSchedules(day.date!, daySchedules)}
            >
              還有 {daySchedules.length - 3} 個排班...
            </div>
          )}

          {/* 拖拽放置提示 - 只在空白格子顯示 */}
          {shouldShowDropHint && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-xs text-green-700 bg-green-100/90 backdrop-blur-md border-2 border-dashed border-green-300/60 px-3 py-2 rounded-lg shadow-md">
                放開以移動排班到這天
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDay;
