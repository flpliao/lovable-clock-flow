
import React from 'react';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, List, Clock, Users } from 'lucide-react';
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
    <div className="space-y-6">
      {/* 視圖選擇 */}
      <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
        <TabsTrigger 
          value="calendar"
          className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden xs:inline">日曆檢視</span>
          <span className="xs:hidden">日曆</span>
        </TabsTrigger>
        <TabsTrigger 
          value="list"
          className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
        >
          <List className="h-4 w-4" />
          <span className="hidden xs:inline">列表檢視</span>
          <span className="xs:hidden">列表</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calendar" className="mt-0 space-y-6">
        {/* 年月選擇器 */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/80 rounded-xl shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">選擇年月</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="h-12 text-sm border-2 border-white/30 rounded-xl bg-white/20 text-white backdrop-blur-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                {generateYears().map((year) => (
                  <SelectItem 
                    key={year} 
                    value={year.toString()}
                    className="py-3 px-4 text-sm hover:bg-gray-50"
                  >
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger className="h-12 text-sm border-2 border-white/30 rounded-xl bg-white/20 text-white backdrop-blur-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
                {generateMonths().map((month) => (
                  <SelectItem 
                    key={month.value} 
                    value={month.value}
                    className="py-3 px-4 text-sm hover:bg-gray-50"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 日曆網格 */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">日曆檢視</h3>
          </div>
          <CalendarGrid
            daysInMonth={daysInMonth}
            onDateClick={onDateClick}
            getScheduleCountForDate={getScheduleCountForDate}
          />
        </div>

        {/* 選中日期的排班詳情 */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/80 rounded-xl shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">排班詳情</h3>
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
      </TabsContent>

      <TabsContent value="list" className="mt-0 space-y-6">
        {/* 員工月份選擇器 */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/80 rounded-xl shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">員工選擇</h3>
          </div>
          
          <StaffMonthSelector
            availableStaff={availableStaff}
            selectedStaffId={selectedStaffId}
            selectedDate={selectedDate}
            onStaffChange={onStaffChange}
            onDateChange={onDateChange}
            getUserRelation={getUserRelation}
          />
        </div>
        
        {/* 月度排班視圖 */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-teal-500/80 rounded-xl shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">月度排班</h3>
          </div>
          
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
