
import React from 'react';
import { Users, Calendar, List } from 'lucide-react';
import CalendarViewSection from './CalendarViewSection';
import ListViewSection from './ListViewSection';
import StaffSelectorCard from './StaffSelectorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <CalendarViewSection
            selectedDate={selectedDate}
            onDateChange={onDateChange}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            onYearChange={onYearChange}
            onMonthChange={onMonthChange}
            generateYears={generateYears}
            generateMonths={generateMonths}
          />
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
