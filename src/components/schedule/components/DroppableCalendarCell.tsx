
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import DraggableScheduleCard from './DraggableScheduleCard';

interface DroppableCalendarCellProps {
  day: any;
  schedules: any[];
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  getScheduleConflicts: (userId: string, date: string) => boolean;
  onScheduleClick: (schedule: any) => void;
  onShowAllSchedules: (date: Date, schedules: any[]) => void;
  selectedScheduleId?: string;
  isExtendedMonth?: boolean;
}

const DroppableCalendarCell = ({
  day,
  schedules,
  getUserName,
  getUserRelation,
  getScheduleConflicts,
  onScheduleClick,
  onShowAllSchedules,
  selectedScheduleId,
  isExtendedMonth = false
}: DroppableCalendarCellProps) => {
  if (!day) {
    return <div className="h-24 border-b border-r border-gray-100"></div>;
  }

  const dateString = format(day.date, 'yyyy-MM-dd');
  const daySchedules = schedules.filter(schedule => schedule.workDate === dateString);
  
  const { setNodeRef, isOver } = useDroppable({
    id: dateString,
    data: {
      type: 'calendar-cell',
      date: dateString
    }
  });

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateString;

  // 根據是否為當前月份調整樣式
  const cellBaseClasses = "h-24 border-b border-r border-gray-100 p-1 transition-colors relative";
  const cellClasses = !day.isCurrentMonth 
    ? `${cellBaseClasses} bg-gray-50` // 非當前月份使用灰色背景
    : `${cellBaseClasses} ${isOver ? 'bg-blue-50' : 'hover:bg-gray-50'}`;

  const dateClasses = !day.isCurrentMonth
    ? "text-xs font-medium text-gray-400" // 非當前月份日期使用淺色
    : `text-xs font-medium ${day.isWeekend ? 'text-red-500' : 'text-gray-700'}`;

  return (
    <div ref={setNodeRef} className={cellClasses}>
      {/* 日期標題 */}
      <div className="flex items-center justify-between mb-1">
        <span className={dateClasses}>
          {day.label}
          {!day.isCurrentMonth && (
            <span className="text-xs text-gray-400 ml-1">
              ({format(day.date, 'M')}月)
            </span>
          )}
        </span>
        {isToday && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>

      {/* 排班卡片區域 */}
      <div className="flex-1 relative">
        {daySchedules.length > 0 && (
          <ScrollArea className="h-16">
            <div className="space-y-1 pr-2">
              {daySchedules.map((schedule) => (
                <DraggableScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  getUserName={getUserName}
                  getUserRelation={getUserRelation}
                  hasConflict={getScheduleConflicts(schedule.userId, dateString)}
                  onClick={() => onScheduleClick(schedule)}
                  isSelected={schedule.id === selectedScheduleId}
                  isInExtendedMonth={!day.isCurrentMonth}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};

export default DroppableCalendarCell;
