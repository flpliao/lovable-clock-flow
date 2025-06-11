
import React from 'react';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, List, Grid } from 'lucide-react';
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
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Grid className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">視圖切換</h3>
        </div>
        
        <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-xl rounded-2xl p-2 h-16 border border-white/30">
          <TabsTrigger 
            value="calendar"
            className="text-white/90 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold flex items-center gap-2 h-12"
          >
            <Calendar className="h-5 w-5" />
            <span className="hidden xs:inline">日曆檢視</span>
            <span className="xs:hidden">日曆</span>
          </TabsTrigger>
          <TabsTrigger 
            value="list"
            className="text-white/90 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold flex items-center gap-2 h-12"
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
