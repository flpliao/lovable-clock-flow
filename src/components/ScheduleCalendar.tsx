
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useScheduleFiltering } from './schedule/hooks/useScheduleFiltering';
import { useDateNavigation } from './schedule/hooks/useDateNavigation';
import { useScheduleViewState } from './schedule/hooks/useScheduleViewState';
import { useSchedulePageState } from './schedule/hooks/useSchedulePageState';
import { useScheduleOperations } from './schedule/hooks/useScheduleOperations';
import ScheduleHeader from './schedule/components/ScheduleHeader';
import ScheduleTabsContent from './schedule/components/ScheduleTabsContent';

const ScheduleCalendar = () => {
  const { viewMode, setViewMode } = useSchedulePageState();
  
  const {
    schedules,
    currentUser,
    getAvailableStaff,
    getUserName,
    getUserRelation,
    handleRemoveSchedule,
    canDeleteSchedule,
    hasSubordinates,
  } = useScheduleOperations();
  
  const { viewableStaffIds, getFilteredSchedulesForDate } = useScheduleFiltering(viewMode);
  const {
    selectedYear,
    selectedMonth,
    selectedDate: dateNavSelectedDate,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDate: setDateNavSelectedDate,
    generateDaysInMonth,
    generateYears,
    generateMonths,
  } = useDateNavigation();

  const {
    viewType,
    setViewType,
    selectedStaffId,
    setSelectedStaffId,
    selectedDate,
    setSelectedDate,
  } = useScheduleViewState();

  console.log('ScheduleCalendar - All schedules:', schedules);
  
  const shiftsForSelectedDate = getFilteredSchedulesForDate(dateNavSelectedDate);
  
  console.log('ScheduleCalendar - Filtered shifts for selected date:', shiftsForSelectedDate);

  const getScheduleCountForDate = (date: Date) => {
    const filteredSchedules = getFilteredSchedulesForDate(date);
    const count = filteredSchedules.length;
    console.log(`ScheduleCalendar - Date ${date.toISOString().split('T')[0]} has ${count} filtered schedules`);
    return count;
  };

  const handleDateClick = (day: any) => {
    if (day && day.date) {
      setDateNavSelectedDate(day.date);
    }
  };

  // 包裝 handleRemoveSchedule 確保它返回 Promise
  const wrappedHandleRemoveSchedule = async (scheduleId: string): Promise<void> => {
    await handleRemoveSchedule(scheduleId);
  };

  const daysInMonth = generateDaysInMonth(getScheduleCountForDate);
  const availableStaff = getAvailableStaff();

  return (
    <div className="space-y-6">
      <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="w-full space-y-6">
        {/* 簡化的查看模式選擇器 */}
        <ScheduleHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasSubordinates={hasSubordinates}
          viewType={viewType}
          onViewTypeChange={setViewType}
        />

        {/* 主要內容 */}
        <ScheduleTabsContent
          schedules={schedules}
          getUserName={getUserName}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={wrappedHandleRemoveSchedule}
        />
      </Tabs>
    </div>
  );
};

export default ScheduleCalendar;
