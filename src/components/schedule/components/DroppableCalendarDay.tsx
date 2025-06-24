
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
    return <div className="min-h-[100px] border-r border-white/10 last:border-r-0"></div>;
  }
  const dateStr = format(day.date, 'yyyy-MM-dd');
  const {
    setNodeRef,
    isOver
  } = useDroppable({
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
  return <div ref={setNodeRef} onClick={handleCellClick} className={`
        min-h-[100px] p-3 border-r border-white/10 last:border-r-0 
        cursor-pointer transition-all duration-300 relative
        ${isExtendedMonth ? 'bg-gray-100/5' : ''}
        ${isToday ? 'bg-gradient-to-br from-cyan-200/25 to-cyan-100/15 shadow-inner border-r-cyan-200/30' : ''}
        ${isOver ? 'bg-gradient-to-br from-green-200/30 to-green-100/20 ring-2 ring-green-300/40 shadow-lg' : 'hover:bg-cyan-50/20 hover:shadow-sm'}
      `}>
      <div className="flex flex-col h-full">
        {/* 日期標題 */}
        <div className={`text-sm mb-1 font-medium drop-shadow-sm ${isCurrentMonth ? day.isWeekend ? 'text-red-500' : 'text-gray-800' : 'text-gray-500'} ${isToday ? 'font-bold text-cyan-700' : ''}`}>
          {day.label}
        </div>
        
        {/* 農曆日期 */}
        {day.lunarDay && <div className={`text-xs mb-2 ${isCurrentMonth ? 'text-gray-600' : 'text-gray-500'}`}>
            {day.lunarDay}
          </div>}

        {/* 排班列表 */}
        <div className="flex-1 space-y-1">
          {daySchedules.slice(0, 3).map(schedule => <DragScheduleCard key={schedule.id} schedule={schedule} getUserName={getUserName} getUserRelation={getUserRelation} hasConflict={getScheduleConflicts(schedule.userId, dateStr)} onClick={() => onScheduleClick(schedule)} />)}
          
          {/* 顯示更多排班提示 */}
          {daySchedules.length > 3 && <div className="text-xs text-gray-700 bg-cyan-100/60 border border-cyan-200/40 px-2 py-1 rounded-lg text-center cursor-pointer hover:bg-cyan-100/70 transition-all duration-200 shadow-sm backdrop-blur-sm">
              還有 {daySchedules.length - 3} 個排班...
            </div>}

          {/* 拖拽提示區域 */}
          {isOver && daySchedules.length === 0 && <div className="text-xs text-green-800 bg-green-100/60 border border-green-200/50 px-2 py-1 rounded-lg text-center border-2 border-dashed shadow-sm backdrop-blur-sm">
              放開以移動排班到這天
            </div>}
        </div>
      </div>
    </div>;
};
export default DroppableCalendarDay;
