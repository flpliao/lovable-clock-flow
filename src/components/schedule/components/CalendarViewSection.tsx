
import React from 'react';
import { Calendar, Users } from 'lucide-react';
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
    <div className="space-y-6">
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
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">日曆檢視</h3>
        </div>
        <CalendarGrid
          daysInMonth={daysInMonth}
          onDateClick={onDateClick}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </div>

      {/* 選中日期的排班詳情 */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">排班詳情</h3>
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
