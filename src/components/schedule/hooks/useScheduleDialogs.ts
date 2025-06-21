
import { useState } from 'react';

export const useScheduleDialogs = () => {
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<any[]>([]);
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);

  const handleScheduleClick = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsEditDialogOpen(true);
  };

  const handleShowAllSchedules = (date: Date, daySchedules: any[]) => {
    setSelectedDayDate(date);
    setSelectedDaySchedules(daySchedules);
    setIsDayDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedSchedule(null);
  };

  const closeDayDialog = () => {
    setIsDayDialogOpen(false);
    setSelectedDayDate(null);
    setSelectedDaySchedules([]);
  };

  return {
    selectedSchedule,
    isEditDialogOpen,
    isDayDialogOpen,
    selectedDaySchedules,
    selectedDayDate,
    handleScheduleClick,
    handleShowAllSchedules,
    closeEditDialog,
    closeDayDialog
  };
};
