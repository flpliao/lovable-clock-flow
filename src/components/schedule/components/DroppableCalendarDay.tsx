
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
  if (!day) {
    return <div className="min-h-[100px] border-r border-b border-white/10 last:border-r-0"></div>;
  }

  const dateStr = format(day.date, 'yyyy-MM-dd');
  const { setNodeRef, isOver } = useDroppable({
    id: dateStr,
    data: {
      date: day.date,
      dateStr: dateStr
    }
  });

  // 篩選當天的排班
  const daySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.workDate);
    return isSameDay(scheduleDate, day.date);
  });

  const isToday = isSameDay(day.date, new Date());
  const isCurrentMonth = day.isCurrentMonth;

  const handleCellClick = () => {
    if (daySchedules.length > 3) {
      onShowAllSchedules(day.date, daySchedules);
    }
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCellClick}
      className={`
        min-h-[100px] p-2 border-r border-b border-white/10 last:border-r-0 
        cursor-pointer transition-all duration-200
        ${isExtendedMonth ? 'bg-white/5' : ''}
        ${isToday ? 'bg-white/20' : ''}
        ${isOver ? 'bg-blue-200/30 ring-2 ring-blue-400/50' : 'hover:bg-white/10'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* 日期標題 */}
        <div className={`text-sm mb-1 font-medium ${
          isCurrentMonth ? (day.isWeekend ? 'text-red-300' : 'text-white/90') : 'text-white/50'
        } ${isToday ? 'font-bold text-white' : ''}`}>
          {day.label}
        </div>
        
        {/* 農曆日期 */}
        {day.lunarDay && (
          <div className={`text-xs mb-2 ${
            isCurrentMonth ? 'text-white/60' : 'text-white/30'
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
            <div className="text-xs text-white/70 bg-white/20 px-2 py-1 rounded text-center cursor-pointer hover:bg-white/30 transition-colors">
              還有 {daySchedules.length - 3} 個排班...
            </div>
          )}

          {/* 拖拽提示區域 */}
          {isOver && daySchedules.length === 0 && (
            <div className="text-xs text-blue-400 bg-blue-100/20 px-2 py-1 rounded text-center border-2 border-dashed border-blue-400/50">
              放開以移動排班到這天
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DroppableCalendarDay;
