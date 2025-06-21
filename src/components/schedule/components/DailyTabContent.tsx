
import React from 'react';
import { Users, Calendar, List } from 'lucide-react';
import ListViewSection from './ListViewSection';
import StaffSelectorCard from './StaffSelectorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DailyTabContentProps {
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
}

const DailyTabContent = ({
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
  onYearChange,
  onMonthChange,
  generateYears,
  generateMonths
}: DailyTabContentProps) => {
  // Simple date picker component for DailyTabContent
  const SimpleDatePicker = () => {
    const handleDateClick = (day: number) => {
      const newDate = new Date(selectedYear, selectedMonth - 1, day);
      onDateChange(newDate);
    };

    const getDaysInMonth = () => {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay();
      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(day);
      }

      return days;
    };

    const days = getDaysInMonth();
    const currentDay = selectedDate.getDate();

    return (
      <div>
        {/* Year and Month selectors */}
        <div className="flex gap-2 mb-4">
          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}年
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generateMonths().map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calendar grid */}
        <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b border-white/20">
            {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
              <div 
                key={day} 
                className={`text-center text-sm font-medium py-3 text-white/90 ${
                  index === 0 || index === 6 ? 'text-red-300' : ''
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => (
              <div key={index} className="border-r border-b border-white/10 last:border-r-0">
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-16 flex items-center justify-center text-sm transition-all hover:bg-white/20 touch-manipulation ${
                      currentDay === day
                        ? 'bg-white/40 text-white font-bold backdrop-blur-xl hover:bg-white/50'
                        : 'text-white/90'
                    }`}
                  >
                    <span className={`text-sm ${currentDay === day ? 'font-bold' : ''}`}>
                      {day}
                    </span>
                  </button>
                ) : (
                  <div className="w-full h-16"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 選擇員工 Card */}
      <StaffSelectorCard
        availableStaff={availableStaff}
        selectedStaffId={selectedStaffId}
        onStaffChange={onStaffChange}
        getUserRelation={getUserRelation}
        icon={Users}
        title="選擇員工"
      />

      {/* 選擇日期 Card */}
      <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span>選擇日期</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleDatePicker />
        </CardContent>
      </Card>

      {/* 排班表 Card */}
      <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
            <List className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span>排班表</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ListViewSection
            availableStaff={availableStaff}
            selectedStaffId={selectedStaffId || 'all'}
            selectedDate={selectedDate}
            onStaffChange={(staffId) => onStaffChange(staffId === 'all' ? undefined : staffId)}
            onDateChange={onDateChange}
            getUserRelation={getUserRelation}
            schedules={schedules}
            getUserName={getUserName}
            viewableStaffIds={viewableStaffIds}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTabContent;
