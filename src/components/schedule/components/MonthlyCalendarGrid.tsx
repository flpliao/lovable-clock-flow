
import React from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import DroppableCalendarDay from './DroppableCalendarDay';
import DragScheduleCard from './DragScheduleCard';
import { useExtendedCalendar } from '../hooks/useExtendedCalendar';
import { useScheduleOperationsHandlers } from '../hooks/useScheduleOperationsHandlers';
import { useScheduleDragDrop } from '../hooks/useScheduleDragDrop';
import { useScheduling } from '@/contexts/SchedulingContext';

interface MonthlyCalendarGridProps {
  selectedDate: Date;
  schedules: any[];
  getUserName: (userId: string) => string;
  selectedSchedule: any;
  handleScheduleClick: (schedule: any) => void;
  handleShowAllSchedules: (date: Date, schedules: any[]) => void;
}

const MonthlyCalendarGrid = ({
  selectedDate,
  schedules,
  getUserName,
  selectedSchedule,
  handleScheduleClick,
  handleShowAllSchedules
}: MonthlyCalendarGridProps) => {
  const { calendarDays } = useExtendedCalendar(selectedDate);
  const { handleUpdateSchedule } = useScheduleOperationsHandlers();
  const { refreshSchedules } = useScheduling();

  const {
    sensors,
    dragSchedules,
    hasScheduleConflict,
    handleDragStart,
    handleDragEnd,
    activeSchedule
  } = useScheduleDragDrop({
    schedules,
    onUpdateSchedule: handleUpdateSchedule,
    onRefreshSchedules: refreshSchedules
  });

  console.log('MonthlyCalendarGrid - Rendering with schedules:', dragSchedules.length);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-white/15 bg-white/5">
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center text-sm font-semibold py-4 ${
                index === 0 || index === 6 ? 'text-red-400' : 'text-gray-700'
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
          <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-xl border border-white/40 transform rotate-2 scale-105">
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
