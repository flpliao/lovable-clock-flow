import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Grid } from 'lucide-react';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useScheduleFiltering } from './schedule/hooks/useScheduleFiltering';
import { useDateNavigation } from './schedule/hooks/useDateNavigation';
import { useScheduleViewState } from './schedule/hooks/useScheduleViewState';
import ViewModeSelector from './schedule/components/ViewModeSelector';
import CalendarGrid from './schedule/components/CalendarGrid';
import ScheduleTable from './schedule/components/ScheduleTable';
import WeekOverview from './schedule/components/WeekOverview';
import MonthlyScheduleView from './schedule/components/MonthlyScheduleView';
import StaffMonthSelector from './schedule/components/StaffMonthSelector';

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

  // 獲取可查看的員工列表
  const getAvailableStaff = () => {
    if (!currentUser) return [];
    
    const availableStaff = [];
    
    // 自己
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
    // 下屬
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      const subordinates = getSubordinates(currentUser.id);
      availableStaff.push(...subordinates);
    }
    
    return availableStaff.filter((staff, index, self) => 
      index === self.findIndex(s => s.id === staff.id)
    );
  };

  // 獲取用戶名稱
  const getUserName = (userId: string) => {
    const user = staffList.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  // 獲取用戶關係標記
  const getUserRelation = (userId: string) => {
    if (!currentUser) return '';
    if (userId === currentUser.id) return '（自己）';
    if (getSubordinates(currentUser.id).some(s => s.id === userId)) return '（下屬）';
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
    return currentUser.role === 'admin' || schedule.userId === currentUser.id;
  };

  const handleDateClick = (day: any) => {
    if (day && day.date) {
      setDateNavSelectedDate(day.date);
    }
  };

  const daysInMonth = generateDaysInMonth(getScheduleCountForDate);

  // 檢查是否為主管
  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const hasSubordinates = isManager && getSubordinates(currentUser?.id || '').length > 0;

  const availableStaff = getAvailableStaff();

  return (
    <div className="space-y-4">
      {/* 查看模式選擇器 */}
      <ViewModeSelector 
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        hasSubordinates={hasSubordinates}
      />

      {/* 視圖類型切換 */}
      <Tabs value={viewType} onValueChange={(value: any) => setViewType(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            月視圖
          </TabsTrigger>
          <TabsTrigger value="daily" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            日視圖
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <StaffMonthSelector
            availableStaff={availableStaff}
            selectedStaffId={selectedStaffId}
            selectedDate={selectedDate}
            onStaffChange={setSelectedStaffId}
            onDateChange={setSelectedDate}
            getUserRelation={getUserRelation}
          />
          
          <MonthlyScheduleView
            selectedDate={selectedDate}
            schedules={schedules.filter(schedule => viewableStaffIds.includes(schedule.userId))}
            getUserName={getUserName}
            selectedStaffId={selectedStaffId}
          />
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <CalendarGrid
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={dateNavSelectedDate}
            daysInMonth={daysInMonth}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            onDateClick={handleDateClick}
            generateYears={generateYears}
            generateMonths={generateMonths}
          />
          
          <ScheduleTable
            selectedDate={dateNavSelectedDate}
            shifts={shiftsForSelectedDate}
            getUserName={getUserName}
            getUserRelation={getUserRelation}
            canDeleteSchedule={canDeleteSchedule}
            onRemoveSchedule={handleRemoveSchedule}
            currentUser={currentUser}
          />

          <WeekOverview
            selectedDate={dateNavSelectedDate}
            onDateSelect={setDateNavSelectedDate}
            getScheduleCountForDate={getScheduleCountForDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScheduleCalendar;
