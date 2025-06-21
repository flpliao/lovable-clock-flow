
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
      date: day.date // 直接傳遞 Date 對象
    }
  });

  const isToday = format(new Date(), 'yyyy-MM-dd') === dateString;

  // 所有日期格子都可以接受drop，增強視覺反饋
  const cellBaseClasses = "h-24 border-b border-r border-gray-100 p-1 transition-all duration-200 relative";
  const cellClasses = !day.isCurrentMonth 
    ? `${cellBaseClasses} bg-gray-50 ${isOver ? 'bg-blue-100 border-blue-300' : ''}` 
    : `${cellBaseClasses} ${isOver ? 'bg-blue-50 border-blue-300 shadow-inner' : 'hover:bg-gray-50'}`;

  const dateClasses = !day.isCurrentMonth
    ? "text-xs font-medium text-gray-400" 
    : `text-xs font-medium ${day.isWeekend ? 'text-red-500' : 'text-gray-700'}`;

  return (
    <div ref={setNodeRef} className={cellClasses}>
      {/* 拖拽懸停時的視覺指示 */}
      {isOver && (
        <div className="absolute inset-0 bg-blue-200/30 border-2 border-blue-400 border-dashed rounded pointer-events-none z-10"></div>
      )}
      
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
                  hasConflict={false} // 移除衝突檢查
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
