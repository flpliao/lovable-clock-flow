
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

  // 獲取某日期的排班數量（已過濾）
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

  const daysInMonth = generateDaysInMonth(getScheduleCountForDate);
  const availableStaff = getAvailableStaff();

  return (
    <div className="space-y-4">
      <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="w-full">
        <ScheduleHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          hasSubordinates={hasSubordinates}
          viewType={viewType}
          onViewTypeChange={setViewType}
        />

        <ScheduleTabsContent
          viewType={viewType}
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={setSelectedStaffId}
          onDateChange={setSelectedDate}
          getUserRelation={getUserRelation}
          schedules={schedules}
          getUserName={getUserName}
          viewableStaffIds={viewableStaffIds}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDateNav={dateNavSelectedDate}
          daysInMonth={daysInMonth}
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
          onDateClick={handleDateClick}
          generateYears={generateYears}
          generateMonths={generateMonths}
          shiftsForSelectedDate={shiftsForSelectedDate}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={handleRemoveSchedule}
          currentUser={currentUser}
          setSelectedDateNav={setDateNavSelectedDate}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </Tabs>
    </div>
  );
};

export default ScheduleCalendar;
