
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
      <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-2xl border border-slate-200 p-1 shadow-lg h-14">
        <TabsTrigger 
          value="calendar"
          className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden xs:inline">日曆檢視</span>
          <span className="xs:hidden">日曆</span>
        </TabsTrigger>
        <TabsTrigger 
          value="list"
          className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
        >
          <List className="h-4 w-4" />
          <span className="hidden xs:inline">列表檢視</span>
          <span className="xs:hidden">列表</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="calendar" className="mt-0 space-y-6">
        {/* 年月選擇器 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">選擇年月</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="h-12 text-sm border-2 border-slate-200 rounded-xl bg-white text-slate-700">
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
              <SelectTrigger className="h-12 text-sm border-2 border-slate-200 rounded-xl bg-white text-slate-700">
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
      </TabsContent>

      <TabsContent value="list" className="mt-0 space-y-6">
        {/* 員工月份選擇器 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-600 rounded-xl shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">員工選擇</h3>
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
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-cyan-600 rounded-xl shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">月度排班</h3>
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
