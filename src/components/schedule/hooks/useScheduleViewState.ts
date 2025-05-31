
import { useState } from 'react';

export const useScheduleViewState = () => {
  const [viewType, setViewType] = useState<'daily' | 'monthly'>('monthly');
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return {
    viewType,
    setViewType,
    selectedStaffId,
    setSelectedStaffId,
    selectedDate,
    setSelectedDate,
  };
};
