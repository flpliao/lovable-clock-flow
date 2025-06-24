
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MonthlyTabContent from './MonthlyTabContent';
import ListViewSection from './ListViewSection';
import CalendarViewSection from './CalendarViewSection';
import DailyTabContent from './DailyTabContent';

interface ScheduleTabsContentProps {
  viewType: string;
  availableStaff: any[];
  selectedStaffId: string;
  selectedDate: Date;
  onStaffChange: (staffId: string) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
  selectedYear: number;
  selectedMonth: number;
  selectedDateNav: Date;
  daysInMonth: any[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDateClick: (day: any) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
  shiftsForSelectedDate: any[];
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
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
  getScheduleCountForDate
}: ScheduleTabsContentProps) => {
  return (
    <>
      <TabsContent value="monthly">
        <MonthlyTabContent
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={onStaffChange}
          getUserRelation={getUserRelation}
          schedules={schedules}
          getUserName={getUserName}
          viewableStaffIds={viewableStaffIds}
        />
      </TabsContent>

      <TabsContent value="list">
        <ListViewSection
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={onStaffChange}
          onDateChange={onDateChange}
          getUserRelation={getUserRelation}
          schedules={schedules}
          getUserName={getUserName}
          viewableStaffIds={viewableStaffIds}
        />
      </TabsContent>

      <TabsContent value="calendar">
        <CalendarViewSection
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDate={selectedDateNav}
          daysInMonth={daysInMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          onDateClick={onDateClick}
          generateYears={generateYears}
          generateMonths={generateMonths}
          shiftsForSelectedDate={shiftsForSelectedDate}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={onRemoveSchedule}
          setSelectedDate={setSelectedDateNav}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </TabsContent>

      <TabsContent value="daily">
        <DailyTabContent
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={onStaffChange}
          onDateChange={onDateChange}
          schedules={schedules}
          getUserName={getUserName}
          getUserRelation={getUserRelation}
          viewableStaffIds={viewableStaffIds}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          generateYears={generateYears}
          generateMonths={generateMonths}
        />
      </TabsContent>
    </>
  );
};

export default ScheduleTabsContent;
