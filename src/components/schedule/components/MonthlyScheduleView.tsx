
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useScheduleDragDrop } from '../hooks/useScheduleDragDrop';
import { useScheduleDialogs } from '../hooks/useScheduleDialogs';
import { useJuneExtendedCalendar } from '../hooks/useJuneExtendedCalendar';
import MonthlyCalendarGrid from './MonthlyCalendarGrid';
import EditScheduleDialog from './EditScheduleDialog';
import DayScheduleDialog from './DayScheduleDialog';

interface MonthlyScheduleViewProps {
  selectedDate: Date;
  schedules: any[];
  getUserName: (userId: string) => string;
  selectedStaffId?: string;
  onUpdateSchedule: (id: string, updates: any) => Promise<void>;
  onDeleteSchedule: (id: string) => Promise<void>;
  timeSlots: Array<{
    id: string;
    name: string;
    start_time: string;
    end_time: string;
  }>;
}

const MonthlyScheduleView = ({ 
  selectedDate, 
  schedules, 
  getUserName, 
  selectedStaffId,
  onUpdateSchedule,
  onDeleteSchedule,
  timeSlots = []
}: MonthlyScheduleViewProps) => {
  const {
    sensors,
    dragSchedules,
    hasScheduleConflict,
    handleDragStart,
    handleDragEnd,
    activeSchedule
  } = useScheduleDragDrop({
    schedules,
    selectedStaffId,
    onUpdateSchedule
  });

  const {
    selectedSchedule,
    isEditDialogOpen,
    isDayDialogOpen,
    selectedDaySchedules,
    selectedDayDate,
    handleScheduleClick,
    handleShowAllSchedules,
    closeEditDialog,
    closeDayDialog
  } = useScheduleDialogs();

  const { isJuneExtended, extendedEndDate } = useJuneExtendedCalendar(selectedDate);

  const handleUpdateSchedule = async (scheduleId: string, updates: any) => {
    await onUpdateSchedule(scheduleId, updates);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    await onDeleteSchedule(scheduleId);
  };

  const getDisplayTitle = () => {
    const baseTitle = format(selectedDate, 'yyyy年MM月', { locale: zhTW });
    if (isJuneExtended) {
      return `${baseTitle} - ${format(extendedEndDate, 'MM月dd日', { locale: zhTW })}`;
    }
    return baseTitle;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            {getDisplayTitle()} 排班總覽
            {selectedStaffId && (
              <span className="ml-2 text-sm sm:text-base text-gray-600">
                - {getUserName(selectedStaffId)}
              </span>
            )}
            {isJuneExtended && (
              <div className="mt-1 text-sm text-blue-600">
                ✨ 六月完整週顯示（含七月初）
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyCalendarGrid
            selectedDate={selectedDate}
            sensors={sensors}
            dragSchedules={dragSchedules}
            hasScheduleConflict={hasScheduleConflict}
            getUserName={getUserName}
            selectedSchedule={selectedSchedule}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleScheduleClick={handleScheduleClick}
            handleShowAllSchedules={handleShowAllSchedules}
            activeSchedule={activeSchedule}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditScheduleDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        schedule={selectedSchedule}
        timeSlots={timeSlots}
        getUserName={getUserName}
        onUpdate={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
      />

      {/* Day Schedule Dialog */}
      <DayScheduleDialog
        isOpen={isDayDialogOpen}
        onClose={closeDayDialog}
        date={selectedDayDate}
        schedules={selectedDaySchedules}
        getUserName={getUserName}
        onScheduleClick={handleScheduleClick}
      />
    </>
  );
};

export default MonthlyScheduleView;
