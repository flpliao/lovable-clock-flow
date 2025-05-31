
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import CalendarGrid from './CalendarGrid';
import ScheduleTable from './ScheduleTable';
import WeekOverview from './WeekOverview';
import MonthlyScheduleView from './MonthlyScheduleView';
import StaffMonthSelector from './StaffMonthSelector';

interface ScheduleTabsContentProps {
  viewType: 'daily' | 'monthly';
  // Monthly view props
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
  // Daily view props
  selectedYear: string;
  selectedMonth: string;
  selectedDateNav: Date;
  daysInMonth: any[];
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onDateClick: (day: any) => void;
  generateYears: () => string[];
  generateMonths: () => { value: string; label: string; }[];
  shiftsForSelectedDate: any[];
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => void;
  currentUser: any;
  setSelectedDateNav: (date: Date) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const ScheduleTabsContent = ({
  viewType,
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  onDateChange,
  getUserRelation,
  schedules,
  getUserName,
  viewableStaffIds,
  selectedYear,
  selectedMonth,
  selectedDateNav,
  daysInMonth,
  onYearChange,
  onMonthChange,
  onDateClick,
  generateYears,
  generateMonths,
  shiftsForSelectedDate,
  canDeleteSchedule,
  onRemoveSchedule,
  currentUser,
  setSelectedDateNav,
  getScheduleCountForDate,
}: ScheduleTabsContentProps) => {
  return (
    <>
      <TabsContent value="monthly" className="space-y-4">
        <StaffMonthSelector
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={onStaffChange}
          onDateChange={onDateChange}
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
          selectedDate={selectedDateNav}
          daysInMonth={daysInMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          onDateClick={onDateClick}
          generateYears={generateYears}
          generateMonths={generateMonths}
        />
        
        <ScheduleTable
          selectedDate={selectedDateNav}
          shifts={shiftsForSelectedDate}
          getUserName={getUserName}
          getUserRelation={getUserRelation}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={onRemoveSchedule}
          currentUser={currentUser}
        />

        <WeekOverview
          selectedDate={selectedDateNav}
          onDateSelect={setSelectedDateNav}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </TabsContent>
    </>
  );
};

export default ScheduleTabsContent;
