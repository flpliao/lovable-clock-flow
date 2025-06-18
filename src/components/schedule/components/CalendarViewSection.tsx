
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
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">選擇年月</h3>
        </div>
        <YearMonthSelectorCard
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          generateYears={generateYears}
          generateMonths={generateMonths}
        />
      </div>

      {/* 日曆網格 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Grid className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">日曆檢視</h3>
        </div>
        <CalendarGrid
          daysInMonth={daysInMonth}
          onDateClick={onDateClick}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </div>

      {/* 排班詳情 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Users className="h-7 w-7 text-white" />
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
