
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar } from 'lucide-react';
import MonthlyScheduleView from './MonthlyScheduleView';
import StaffSelectorCard from './StaffSelectorCard';
import MonthSelectorCard from './MonthSelectorCard';

interface MonthlyTabContentProps {
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
  onUpdateSchedule: (id: string, updates: any) => Promise<void>;
  onDeleteSchedule: (id: string) => Promise<void>;
}

const MonthlyTabContent = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  getUserRelation,
  schedules,
  getUserName,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  generateYears,
  generateMonths,
  onUpdateSchedule,
  onDeleteSchedule
}: MonthlyTabContentProps) => {
  const mockTimeSlots = [
    { id: '1', name: '早班', start_time: '08:00', end_time: '16:00' },
    { id: '2', name: '中班', start_time: '16:00', end_time: '24:00' },
    { id: '3', name: '晚班', start_time: '00:00', end_time: '08:00' },
  ];

  return (
    <div className="space-y-6">
      {/* 員工選擇器 */}
      <StaffSelectorCard
        availableStaff={availableStaff}
        selectedStaffId={selectedStaffId}
        onStaffChange={onStaffChange}
        getUserRelation={getUserRelation}
        icon={Users}
        title="選擇查看員工"
      />

      {/* 月份選擇器 */}
      <MonthSelectorCard
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={onYearChange}
        onMonthChange={onMonthChange}
        generateYears={generateYears}
        generateMonths={generateMonths}
      />

      {/* 月度排班視圖 */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl overflow-hidden">
        <MonthlyScheduleView
          selectedDate={selectedDate}
          schedules={schedules}
          getUserName={getUserName}
          selectedStaffId={selectedStaffId}
          onUpdateSchedule={onUpdateSchedule}
          onDeleteSchedule={onDeleteSchedule}
          timeSlots={mockTimeSlots}
        />
      </div>
    </div>
  );
};

export default MonthlyTabContent;
