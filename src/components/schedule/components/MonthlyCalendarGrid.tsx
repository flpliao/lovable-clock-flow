import { Schedule } from '@/contexts/scheduling/types';
import { CreateSchedule } from '@/services/scheduleService';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useExtendedCalendar } from '../hooks/useExtendedCalendar';
import { useScheduleDragDrop } from '../hooks/useScheduleDragDrop';
import { useScheduleOperationsHandlers } from '../hooks/useScheduleOperationsHandlers';
import DragScheduleCard from './DragScheduleCard';
import DroppableCalendarDay from './DroppableCalendarDay';

interface MonthlyCalendarGridProps {
  selectedDate: Date;
  schedules: Schedule[];
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  selectedSchedule?: Schedule | null;
  handleScheduleClick: (schedule: Schedule) => void;
  handleShowAllSchedules: (date: Date, schedules: Schedule[]) => void;
  onRefreshSchedules?: () => Promise<void>;
}

interface DragUpdateParams {
  workDate?: string;
  timeSlot?: string;
  startTime?: string;
  endTime?: string;
}

const MonthlyCalendarGrid = ({
  selectedDate,
  schedules,
  getUserName,
  getUserRelation,
  selectedSchedule,
  handleScheduleClick,
  handleShowAllSchedules,
  onRefreshSchedules,
}: MonthlyCalendarGridProps) => {
  const { calendarDays } = useExtendedCalendar(selectedDate);
  const { handleUpdateSchedule } = useScheduleOperationsHandlers({
    onScheduleUpdated: async () => {
      console.log('Schedule updated, refreshing...');
      if (onRefreshSchedules) {
        await onRefreshSchedules();
      }
    },
  });

  // 包裝更新函數以處理格式轉換
  const handleScheduleUpdateWrapper = async (scheduleId: string, updates: DragUpdateParams) => {
    console.log('MonthlyCalendarGrid - handleScheduleUpdateWrapper called with:', {
      scheduleId,
      updates,
    });

    // 轉換 workDate 為 work_date 格式
    const convertedUpdates: Partial<CreateSchedule> = {};
    if (updates.workDate) {
      convertedUpdates.work_date = updates.workDate;
    }
    if (updates.timeSlot) {
      convertedUpdates.time_slot = updates.timeSlot;
    }
    if (updates.startTime) {
      convertedUpdates.start_time = updates.startTime;
    }
    if (updates.endTime) {
      convertedUpdates.end_time = updates.endTime;
    }

    console.log('MonthlyCalendarGrid - converted updates:', convertedUpdates);

    try {
      await handleUpdateSchedule(scheduleId, convertedUpdates);
      // 更新成功後立即刷新排班資料
      if (onRefreshSchedules) {
        console.log('MonthlyCalendarGrid - Refreshing schedules after update...');
        await onRefreshSchedules();
      }
    } catch (error) {
      console.error('MonthlyCalendarGrid - Update failed:', error);
      throw error;
    }
  };

  const {
    sensors,
    dragSchedules,
    hasScheduleConflict,
    handleDragStart,
    handleDragEnd,
    activeSchedule,
  } = useScheduleDragDrop({
    schedules,
    onUpdateSchedule: handleScheduleUpdateWrapper,
    onRefreshSchedules,
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
              getUserRelation={getUserRelation}
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
              getUserRelation={getUserRelation}
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
