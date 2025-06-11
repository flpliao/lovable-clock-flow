
import React from 'react';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List } from 'lucide-react';
import CalendarViewSection from './CalendarViewSection';
import ListViewSection from './ListViewSection';

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
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (id: string) => void;
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
  getScheduleCountForDate,
}: ScheduleTabsContentProps) => {
  return (
    <div className="space-y-8">
      {/* 視圖選擇 */}
      <div className="backdrop-blur-2xl bg-white/15 border border-white/20 rounded-3xl shadow-2xl p-6">
        <TabsList className="grid w-full grid-cols-2 backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-1 shadow-lg h-16">
          <TabsTrigger 
            value="calendar"
            className="text-white/80 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
          >
            <Calendar className="h-5 w-5" />
            <span className="hidden xs:inline">日曆檢視</span>
            <span className="xs:hidden">日曆</span>
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-white/80 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
          >
            <List className="h-5 w-5" />
            <span className="hidden xs:inline">列表檢視</span>
            <span className="xs:hidden">列表</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="calendar" className="mt-0">
        <CalendarViewSection
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          selectedDateNav={selectedDateNav}
          daysInMonth={daysInMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          onDateClick={onDateClick}
          generateYears={generateYears}
          generateMonths={generateMonths}
          shiftsForSelectedDate={shiftsForSelectedDate}
          getUserName={getUserName}
          getUserRelation={getUserRelation}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={onRemoveSchedule}
          getScheduleCountForDate={getScheduleCountForDate}
        />
      </TabsContent>

      <TabsContent value="list" className="mt-0">
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
    </div>
  );
};

export default ScheduleTabsContent;
