
import React from 'react';
import { Calendar, Users, Grid } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import ScheduleTable from './ScheduleTable';
import YearMonthSelectorCard from './YearMonthSelectorCard';

interface CalendarViewSectionProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDateNav: Date;
  daysInMonth: any[];
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onDateClick: (day: any) => void;
  generateYears: () => number[];
  generateMonths: () => { value: string; label: string; }[];
  shiftsForSelectedDate: any[];
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (id: string) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const CalendarViewSection = ({
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
  getUserName,
  getUserRelation,
  canDeleteSchedule,
  onRemoveSchedule,
  getScheduleCountForDate,
}: CalendarViewSectionProps) => {
  return (
    <div className="space-y-8">
      {/* 年月選擇器 */}
      <YearMonthSelectorCard
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        generateYears={generateYears}
        generateMonths={generateMonths}
      />

      {/* 日曆網格 */}
      <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border border-white/20">
            <Grid className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">日曆檢視</h3>
        </div>
        <CalendarGrid
          daysInMonth={daysInMonth}
          onDateClick={onDateClick}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </div>

      {/* 選中日期的排班詳情 */}
      <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg border border-white/20">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">排班詳情</h3>
        </div>
        
        <ScheduleTable
          shiftsForSelectedDate={shiftsForSelectedDate}
          getUserName={getUserName}
          getUserRelation={getUserRelation}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={onRemoveSchedule}
          selectedDateNav={selectedDateNav}
        />
      </div>
    </div>
  );
};

export default CalendarViewSection;
