
import React, { useState } from 'react';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useScheduleFiltering } from './schedule/hooks/useScheduleFiltering';
import { useDateNavigation } from './schedule/hooks/useDateNavigation';
import ViewModeSelector from './schedule/components/ViewModeSelector';
import CalendarGrid from './schedule/components/CalendarGrid';
import ScheduleTable from './schedule/components/ScheduleTable';
import WeekOverview from './schedule/components/WeekOverview';
import DebugInfo from './schedule/components/DebugInfo';

const ScheduleCalendar = () => {
  const [viewMode, setViewMode] = useState<'self' | 'subordinates' | 'all'>('self');
  
  const { schedules, removeSchedule } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  const { viewableStaffIds, getFilteredSchedulesForDate } = useScheduleFiltering(viewMode);
  const {
    selectedYear,
    selectedMonth,
    selectedDate,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDate,
    generateDaysInMonth,
    generateYears,
    generateMonths,
  } = useDateNavigation();

  console.log('ScheduleCalendar - All schedules:', schedules);
  
  const shiftsForSelectedDate = getFilteredSchedulesForDate(selectedDate);
  
  console.log('ScheduleCalendar - Filtered shifts for selected date:', shiftsForSelectedDate);

  // 獲取用戶名稱
  const getUserName = (userId: string) => {
    const user = staffList.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  // 獲取用戶關係標記
  const getUserRelation = (userId: string) => {
    if (!currentUser) return '';
    if (userId === currentUser.id) return '自己';
    if (getSubordinates(currentUser.id).some(s => s.id === userId)) return '下屬';
    return '';
  };

  // 獲取某日期的排班數量（已過濾）
  const getScheduleCountForDate = (date: Date) => {
    const filteredSchedules = getFilteredSchedulesForDate(date);
    const count = filteredSchedules.length;
    console.log(`ScheduleCalendar - Date ${date.toISOString().split('T')[0]} has ${count} filtered schedules`);
    return count;
  };

  // 刪除排班
  const handleRemoveSchedule = (scheduleId: string) => {
    removeSchedule(scheduleId);
    toast({
      title: '刪除成功',
      description: '排班記錄已刪除',
    });
  };

  // 檢查是否可以刪除排班
  const canDeleteSchedule = (schedule: any) => {
    if (!currentUser) return false;
    // 管理員可以刪除所有排班，員工只能刪除自己的排班
    return currentUser.role === 'admin' || schedule.userId === currentUser.id;
  };

  const handleDateClick = (day: any) => {
    if (day && day.date) {
      setSelectedDate(day.date);
    }
  };

  const daysInMonth = generateDaysInMonth(getScheduleCountForDate);

  // 檢查是否為主管
  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const hasSubordinates = isManager && getSubordinates(currentUser?.id || '').length > 0;

  return (
    <div className="space-y-4">
      <ViewModeSelector 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasSubordinates={hasSubordinates}
      />

      <CalendarGrid
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedDate={selectedDate}
        daysInMonth={daysInMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onDateClick={handleDateClick}
        generateYears={generateYears}
        generateMonths={generateMonths}
      />
      
      <ScheduleTable
        selectedDate={selectedDate}
        shifts={shiftsForSelectedDate}
        getUserName={getUserName}
        getUserRelation={getUserRelation}
        canDeleteSchedule={canDeleteSchedule}
        onRemoveSchedule={handleRemoveSchedule}
        currentUser={currentUser}
      />

      <WeekOverview
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        getScheduleCountForDate={getScheduleCountForDate}
      />

      <DebugInfo
        schedules={schedules}
        viewableStaffIds={viewableStaffIds}
        selectedDate={selectedDate}
        shiftsForSelectedDate={shiftsForSelectedDate}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ScheduleCalendar;
