
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useScheduleDragDrop } from '../hooks/useScheduleDragDrop';
import { useScheduleDialogs } from '../hooks/useScheduleDialogs';
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

  const handleUpdateSchedule = async (scheduleId: string, updates: any) => {
    await onUpdateSchedule(scheduleId, updates);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    await onDeleteSchedule(scheduleId);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            {format(selectedDate, 'yyyy年MM月', { locale: zhTW })} 排班總覽
            {selectedStaffId && (
              <span className="ml-2 text-sm sm:text-base text-gray-600">
                - {getUserName(selectedStaffId)}
              </span>
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
