
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
    <div className="space-y-6">
      {/* 簡化的視圖選擇 */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-4">
        <TabsList className="grid w-full grid-cols-2 bg-white/50 rounded-lg p-1 h-12">
          <TabsTrigger 
            value="calendar"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden xs:inline">日曆檢視</span>
            <span className="xs:hidden">日曆</span>
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
          >
            <List className="h-4 w-4" />
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
