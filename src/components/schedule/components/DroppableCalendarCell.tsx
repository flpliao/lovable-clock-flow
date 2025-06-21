
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format, getDay } from 'date-fns';
import DraggableScheduleCard from './DraggableScheduleCard';

interface DroppableCalendarCellProps {
  day: {
    date: Date;
    label: string;
    lunarDay?: string;
    isWeekend: boolean;
  } | null;
  schedules: Array<{
    id: string;
    userId: string;
    workDate: string;
    timeSlot: string;
    startTime: string;
    endTime: string;
  }>;
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  getScheduleConflicts: (userId: string, date: string) => boolean;
  onScheduleClick: (schedule: any) => void;
  onShowAllSchedules: (date: Date, schedules: any[]) => void;
  selectedScheduleId?: string;
}

const DroppableCalendarCell = ({
  day,
  schedules,
  getUserName,
  getUserRelation,
  getScheduleConflicts,
  onScheduleClick,
  onShowAllSchedules,
  selectedScheduleId
}: DroppableCalendarCellProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day ? format(day.date, 'yyyy-MM-dd') : 'empty',
    data: { date: day?.date },
    disabled: !day,
  });

  if (!day) {
    return <div className="h-16 sm:h-24"></div>;
  }

  const daySchedules = schedules.filter(s => s.workDate === format(day.date, 'yyyy-MM-dd'));
  const isWeekend = getDay(day.date) === 0 || getDay(day.date) === 6;
  const maxDisplay = 3;
  const displaySchedules = daySchedules.slice(0, maxDisplay);
  const remainingCount = daySchedules.length - maxDisplay;

  return (
    <div
      ref={setNodeRef}
      className={`
        border-r border-b border-gray-50 last:border-r-0 min-h-16 sm:min-h-24 p-1
        transition-colors duration-200
        ${isWeekend ? 'bg-red-50' : 'bg-white'}
        ${isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''}
      `}
    >
      {/* 日期標題 */}
      <div className={`text-xs sm:text-sm font-medium mb-1 ${
        isWeekend ? 'text-red-600' : 'text-gray-900'
      }`}>
        {day.label}
      </div>

      {/* 農曆日期 */}
      {day.lunarDay && (
        <div className="text-[10px] sm:text-xs text-gray-500 mb-1">
          {day.lunarDay}
        </div>
      )}

      {/* 排班列表 */}
      <div className="space-y-1">
        {displaySchedules.map((schedule) => (
          <DraggableScheduleCard
            key={schedule.id}
            schedule={schedule}
            getUserName={getUserName}
            getUserRelation={getUserRelation}
            hasConflict={getScheduleConflicts(schedule.userId, schedule.workDate)}
            isSelected={selectedScheduleId === schedule.id}
            onClick={() => onScheduleClick(schedule)}
          />
        ))}
        
        {/* 顯示更多指示器 */}
        {remainingCount > 0 && (
          <div 
            className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1 text-center cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onShowAllSchedules(day.date, daySchedules)}
          >
            +{remainingCount} 更多
          </div>
        )}
      </div>
    </div>
  );
};

export default DroppableCalendarCell;
