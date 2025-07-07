import { Schedule } from '@/contexts/scheduling/types';
import { CreateSchedule } from '@/services/scheduleService';
import { useDragDrop } from '../hooks/useDragDrop';
import { useExtendedCalendar } from '../hooks/useExtendedCalendar';
import { useScheduleOperationsHandlers } from '../hooks/useScheduleOperationsHandlers';
import CalendarDay from './CalendarDay';

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

  const { isDragging, draggedScheduleId, filteredSchedules, makeDraggable, makeDropTarget } =
    useDragDrop({
      schedules,
      onUpdateSchedule: handleScheduleUpdateWrapper,
      onRefreshSchedules,
    });

  // 檢查排班衝突
  const hasScheduleConflict = (schedule: Schedule): Schedule[] => {
    return filteredSchedules.filter(
      s =>
        s.id !== schedule.id &&
        s.workDate === schedule.workDate &&
        s.userId === schedule.userId &&
        ((schedule.startTime >= s.startTime && schedule.startTime < s.endTime) ||
          (schedule.endTime > s.startTime && schedule.endTime <= s.endTime) ||
          (schedule.startTime <= s.startTime && schedule.endTime >= s.endTime))
    );
  };

  console.log('MonthlyCalendarGrid - Rendering with schedules:', filteredSchedules.length);

  return (
    <div className="backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
      {/* Calendar grid with headers and cells */}
      <div className="grid grid-cols-7 grid-rows-[auto_repeat(6,_minmax(120px,_1fr))]">
        {/* Week day headers - 第一行 */}
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-semibold py-4 border-b border-white/15 bg-white/5 ${
              index === 0 || index === 6 ? 'text-red-400' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}

        {/* Calendar cells - 接下來的行 */}
        {calendarDays.map((day, index) => (
          <CalendarDay
            key={`${day?.date?.getTime() || index}-${index}`}
            day={day}
            schedules={filteredSchedules}
            getUserName={getUserName}
            getUserRelation={getUserRelation}
            getScheduleConflicts={hasScheduleConflict}
            onScheduleClick={handleScheduleClick}
            onShowAllSchedules={handleShowAllSchedules}
            isExtendedMonth={day?.isExtended}
            makeDropTarget={makeDropTarget}
            makeDraggable={makeDraggable}
            isDragging={isDragging}
            draggedScheduleId={draggedScheduleId}
          />
        ))}
      </div>
    </div>
  );
};

export default MonthlyCalendarGrid;
