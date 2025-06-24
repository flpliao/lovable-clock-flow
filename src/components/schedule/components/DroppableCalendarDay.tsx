
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format, isSameDay } from 'date-fns';
import DragScheduleCard from './DragScheduleCard';

interface DroppableCalendarDayProps {
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

const DroppableCalendarDay = ({
  day,
  schedules,
  getUserName,
  getUserRelation,
  getScheduleConflicts,
  onScheduleClick,
  onShowAllSchedules,
  selectedScheduleId,
  isExtendedMonth = false
}: DroppableCalendarDayProps) => {
  if (!day || !day.date) {
    return <div className="min-h-[100px] border-r border-b border-gray-200/50 last:border-r-0"></div>;
  }

  const dateStr = format(day.date, 'yyyy-MM-dd');
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${dateStr}`,
    data: {
      date: day.date,
      dateStr: dateStr
    }
  });

  // 篩選當天的排班
  const daySchedules = schedules.filter(schedule => {
    if (!schedule?.workDate) return false;
    try {
      const scheduleDate = new Date(schedule.workDate);
      return isSameDay(scheduleDate, day.date);
    } catch (error) {
      console.error('Error comparing dates:', error, schedule.workDate);
      return false;
    }
  });

  const isToday = isSameDay(day.date, new Date());
  const isCurrentMonth = day.isCurrentMonth;

  const handleCellClick = () => {
    if (daySchedules.length > 3) {
      onShowAllSchedules(day.date, daySchedules);
    }
  };

  console.log(`DroppableCalendarDay - ${dateStr} has ${daySchedules.length} schedules`);

  return (
    <div
      ref={setNodeRef}
      onClick={handleCellClick}
      className={`
        min-h-[100px] p-3 border-r border-b border-gray-200/50 last:border-r-0 
        cursor-pointer transition-all duration-200
        ${isExtendedMonth ? 'bg-gray-100/30' : ''}
        ${isToday ? 'bg-gradient-to-br from-blue-400/20 to-blue-300/10 shadow-inner' : ''}
        ${isOver ? 'bg-gradient-to-br from-green-400/30 to-green-300/20 ring-2 ring-green-400/50 shadow-lg' : 'hover:bg-white/40 hover:shadow-md'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* 日期標題 */}
        <div className={`text-sm mb-1 font-semibold drop-shadow-sm ${
          isCurrentMonth ? (day.isWeekend ? 'text-red-500' : 'text-gray-700') : 'text-gray-400'
        } ${isToday ? 'font-bold text-blue-700' : ''}`}>
          {day.label}
        </div>
        
        {/* 農曆日期 */}
        {day.lunarDay && (
          <div className={`text-xs mb-2 ${
            isCurrentMonth ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {day.lunarDay}
          </div>
        )}

        {/* 排班列表 */}
        <div className="flex-1 space-y-1">
          {daySchedules.slice(0, 3).map((schedule) => (
            <DragScheduleCard
              key={schedule.id}
              schedule={schedule}
              getUserName={getUserName}
              getUserRelation={getUserRelation}
              hasConflict={getScheduleConflicts(schedule.userId, dateStr)}
              onClick={() => onScheduleClick(schedule)}
            />
          ))}
          
          {/* 顯示更多排班提示 */}
          {daySchedules.length > 3 && (
            <div className="text-xs text-gray-600 bg-gradient-to-r from-white/70 to-white/50 px-2 py-1 rounded-lg text-center cursor-pointer hover:from-white/80 hover:to-white/60 transition-all duration-200 shadow-sm border border-white/40">
              還有 {daySchedules.length - 3} 個排班...
            </div>
          )}

          {/* 拖拽提示區域 */}
          {isOver && daySchedules.length === 0 && (
            <div className="text-xs text-green-700 bg-gradient-to-r from-green-200/60 to-green-100/40 px-2 py-1 rounded-lg text-center border-2 border-dashed border-green-400/50 shadow-sm backdrop-blur-sm">
              放開以移動排班到這天
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DroppableCalendarDay;
