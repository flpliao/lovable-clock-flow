
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import MonthlyTabContent from './MonthlyTabContent';
import DailyTabContent from './DailyTabContent';
import { useScheduleOperationsHandlers } from '../hooks/useScheduleOperationsHandlers';

interface ScheduleTabsContentProps {
  viewType: string;
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
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
  onRemoveSchedule: (id: string) => void;
  currentUser: any;
  setSelectedDateNav: (date: Date) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const ScheduleTabsContent = (props: ScheduleTabsContentProps) => {
  const { handleUpdateSchedule, handleDeleteSchedule } = useScheduleOperationsHandlers();

  return (
    <>
      <TabsContent value="monthly" className="mt-0">
        <MonthlyTabContent
          availableStaff={props.availableStaff}
          selectedStaffId={props.selectedStaffId}
          selectedDate={props.selectedDate}
          onStaffChange={props.onStaffChange}
          getUserRelation={props.getUserRelation}
          schedules={props.schedules}
          getUserName={props.getUserName}
          selectedYear={props.selectedYear}
          selectedMonth={props.selectedMonth}
          onYearChange={props.onYearChange}
          onMonthChange={props.onMonthChange}
          generateYears={props.generateYears}
          generateMonths={props.generateMonths}
          onUpdateSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
        />
      </TabsContent>

      <TabsContent value="daily" className="mt-0">
        <DailyTabContent
          availableStaff={props.availableStaff}
          selectedStaffId={props.selectedStaffId}
          selectedDate={props.selectedDate}
          onStaffChange={props.onStaffChange}
          onDateChange={props.onDateChange}
          getUserRelation={props.getUserRelation}
          schedules={props.schedules}
          getUserName={props.getUserName}
          viewableStaffIds={props.viewableStaffIds}
          selectedYear={props.selectedYear}
          selectedMonth={props.selectedMonth}
          onYearChange={props.onYearChange}
          onMonthChange={props.onMonthChange}
          generateYears={props.generateYears}
          generateMonths={props.generateMonths}
        />
      </TabsContent>
    </>
  );
};

export default ScheduleTabsContent;
