
import React from 'react';
import { Calendar, Users, Grid } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import ScheduleTable from './ScheduleTable';
import YearMonthSelectorCard from './YearMonthSelectorCard';
import { visionProStyles } from '@/utils/visionProStyles';

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
      <div className={`${visionProStyles.dashboardCard} p-8`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={visionProStyles.coloredIconContainer.blue}>
            <Grid className="h-6 w-6" />
          </div>
          <h3 className={`text-2xl font-bold ${visionProStyles.primaryText}`}>日曆檢視</h3>
        </div>
        <CalendarGrid
          daysInMonth={daysInMonth}
          onDateClick={onDateClick}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </div>

      {/* 選中日期的排班詳情 */}
      <div className={`${visionProStyles.dashboardCard} p-8`}>
        <div className="flex items-center gap-4 mb-6">
          <div className={visionProStyles.coloredIconContainer.purple}>
            <Users className="h-6 w-6" />
          </div>
          <h3 className={`text-2xl font-bold ${visionProStyles.primaryText}`}>排班詳情</h3>
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
