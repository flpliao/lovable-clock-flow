
import React from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import DroppableCalendarDay from './DroppableCalendarDay';
import DragScheduleCard from './DragScheduleCard';
import { useExtendedCalendar } from '../hooks/useExtendedCalendar';

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
  const { calendarDays } = useExtendedCalendar(selectedDate);

  console.log('MonthlyCalendarGrid - Rendering with schedules:', dragSchedules.length);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-white/20">
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center text-sm font-medium py-3 text-white/90 ${
                index === 0 || index === 6 ? 'text-red-300' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar cells with drag and drop */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <DroppableCalendarDay
              key={`${day?.date?.getTime() || index}-${index}`}
              day={day}
              schedules={dragSchedules}
              getUserName={getUserName}
              getUserRelation={() => ''}
              getScheduleConflicts={hasScheduleConflict}
              onScheduleClick={handleScheduleClick}
              onShowAllSchedules={handleShowAllSchedules}
              selectedScheduleId={selectedSchedule?.id}
              isExtendedMonth={day?.isExtended}
            />
          ))}
        </div>
      </div>

      {/* Drag overlay for better visual feedback */}
      <DragOverlay>
        {activeSchedule ? (
          <div className="bg-white/95 shadow-2xl rounded-lg border border-white/30 transform rotate-3 scale-105">
            <DragScheduleCard
              schedule={activeSchedule}
              getUserName={getUserName}
              getUserRelation={() => ''}
              hasConflict={false}
              onClick={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default MonthlyCalendarGrid;
