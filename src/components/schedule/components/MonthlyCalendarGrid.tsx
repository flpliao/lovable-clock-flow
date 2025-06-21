
import React from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import DroppableCalendarCell from './DroppableCalendarCell';
import DraggableScheduleCard from './DraggableScheduleCard';
import { useJuneExtendedCalendar } from '../hooks/useJuneExtendedCalendar';

interface MonthlyCalendarGridProps {
  selectedDate: Date;
  sensors: any;
  dragSchedules: any[];
  hasScheduleConflict: (userId: string, date: string) => boolean;
  getUserName: (userId: string) => string;
  selectedSchedule: any;
  handleDragStart: (event: any) => void;
  handleDragEnd: (event: any) => void;
  handleScheduleClick: (schedule: any) => void;
  handleShowAllSchedules: (date: Date, schedules: any[]) => void;
  activeSchedule: any;
}

const MonthlyCalendarGrid = ({
  selectedDate,
  sensors,
  dragSchedules,
  hasScheduleConflict,
  getUserName,
  selectedSchedule,
  handleDragStart,
  handleDragEnd,
  handleScheduleClick,
  handleShowAllSchedules,
  activeSchedule
}: MonthlyCalendarGridProps) => {
  const { calendarDays, isJuneExtended } = useJuneExtendedCalendar(selectedDate);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div 
            key={day} 
            className={`text-center text-xs sm:text-sm font-medium py-2 border-b border-gray-100 ${
              index === 0 || index === 6 ? 'text-red-500 bg-red-50' : 'text-gray-700 bg-gray-50'
            }`}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar cells */}
        {calendarDays.map((day, index) => (
          <DroppableCalendarCell
            key={index}
            day={day}
            schedules={dragSchedules}
            getUserName={getUserName}
            getUserRelation={() => ''}
            getScheduleConflicts={hasScheduleConflict}
            onScheduleClick={handleScheduleClick}
            onShowAllSchedules={handleShowAllSchedules}
            selectedScheduleId={selectedSchedule?.id}
            isExtendedMonth={day?.isExtended} // 傳遞是否為延伸月份的標記
          />
        ))}
      </div>

      {/* 六月延伸提示 */}
      {isJuneExtended && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          * 六月顯示已延伸至完整週，包含七月初部分日期
        </div>
      )}

      {/* Drag overlay */}
      <DragOverlay>
        {activeSchedule ? (
          <DraggableScheduleCard
            schedule={activeSchedule}
            getUserName={getUserName}
            getUserRelation={() => ''}
            hasConflict={false}
            onClick={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default MonthlyCalendarGrid;
