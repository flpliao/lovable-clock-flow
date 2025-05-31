
import React from 'react';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, List } from 'lucide-react';
import CalendarGrid from './CalendarGrid';
import ScheduleTable from './ScheduleTable';
import MonthlyScheduleView from './MonthlyScheduleView';
import StaffMonthSelector from './StaffMonthSelector';

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
  currentUser,
  setSelectedDateNav,
  getScheduleCountForDate,
}: ScheduleTabsContentProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* 手機優化的Tab列表 */}
      <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
        <TabsTrigger 
          value="calendar"
          className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium h-8 sm:h-10 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
        >
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">日曆檢視</span>
          <span className="xs:hidden">日曆</span>
        </TabsTrigger>
        <TabsTrigger 
          value="list"
          className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium h-8 sm:h-10 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
        >
          <List className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">列表檢視</span>
          <span className="xs:hidden">列表</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calendar" className="mt-0 space-y-3 sm:space-y-4">
        {/* 年月選擇器 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="h-10 sm:h-12 text-xs sm:text-sm border-2 border-gray-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
              {generateYears().map((year) => (
                <SelectItem 
                  key={year} 
                  value={year.toString()}
                  className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm hover:bg-gray-50"
                >
                  {year}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="h-10 sm:h-12 text-xs sm:text-sm border-2 border-gray-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
              {generateMonths().map((month) => (
                <SelectItem 
                  key={month.value} 
                  value={month.value}
                  className="py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm hover:bg-gray-50"
                >
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 日曆網格 */}
        <CalendarGrid
          daysInMonth={daysInMonth}
          onDateClick={onDateClick}
          getScheduleCountForDate={getScheduleCountForDate}
        />

        {/* 選中日期的排班詳情 */}
        <ScheduleTable
          shiftsForSelectedDate={shiftsForSelectedDate}
          getUserName={getUserName}
          getUserRelation={getUserRelation}
          canDeleteSchedule={canDeleteSchedule}
          onRemoveSchedule={onRemoveSchedule}
          selectedDateNav={selectedDateNav}
        />
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <StaffMonthSelector
          availableStaff={availableStaff}
          selectedStaffId={selectedStaffId}
          selectedDate={selectedDate}
          onStaffChange={onStaffChange}
          onDateChange={onDateChange}
          getUserRelation={getUserRelation}
        />
        
        <div className="mt-3 sm:mt-4">
          <MonthlyScheduleView
            selectedDate={selectedDate}
            schedules={schedules.filter(schedule => viewableStaffIds.includes(schedule.userId))}
            getUserName={getUserName}
            selectedStaffId={selectedStaffId === 'all' ? undefined : selectedStaffId}
          />
        </div>
      </TabsContent>
    </div>
  );
};

export default ScheduleTabsContent;
