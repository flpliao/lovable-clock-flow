
import React from 'react';
import CalendarViewHeader from './calendarView/CalendarViewHeader';
import CalendarGrid from './calendarView/CalendarGrid';
import ScheduleDetails from './calendarView/ScheduleDetails';

interface CalendarViewSectionProps {
  selectedYear: number;
  selectedMonth: number;
  selectedDate: Date;
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
  setSelectedDate: (date: Date) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const CalendarViewSection = ({
  selectedYear,
  selectedMonth,
  selectedDate,
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
  setSelectedDate,
  getScheduleCountForDate,
}: CalendarViewSectionProps) => {
  return (
    <div className="space-y-6">
      {/* 年月選擇器 */}
      <CalendarViewHeader
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        generateYears={generateYears}
        generateMonths={generateMonths}
      />

      {/* 日曆網格 */}
      <CalendarGrid
        selectedDate={selectedDate}
        daysInMonth={daysInMonth}
        onDateClick={onDateClick}
      />

      {/* 選中日期的排班詳情 */}
      <ScheduleDetails
        selectedDate={selectedDate}
        shiftsForSelectedDate={shiftsForSelectedDate}
        canDeleteSchedule={canDeleteSchedule}
        onRemoveSchedule={onRemoveSchedule}
      />
    </div>
  );
};

export default CalendarViewSection;
