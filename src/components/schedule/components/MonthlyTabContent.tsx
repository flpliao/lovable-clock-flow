
import React, { useState, useEffect } from 'react';
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
  viewableStaffIds: string[];
}

const MonthlyTabContent = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  getUserRelation,
  schedules,
  getUserName,
  viewableStaffIds
}: MonthlyTabContentProps) => {
  // 新增：排班總覽的獨立日期狀態
  const [overviewDate, setOverviewDate] = useState<Date>(selectedDate);

  // 當外部 selectedDate 改變時，同步更新 overviewDate
  useEffect(() => {
    setOverviewDate(selectedDate);
  }, [selectedDate]);

  const mockTimeSlots = [
    { id: '1', name: '早班', start_time: '08:00', end_time: '16:00' },
    { id: '2', name: '中班', start_time: '16:00', end_time: '24:00' },
    { id: '3', name: '晚班', start_time: '00:00', end_time: '08:00' },
  ];

  // Mock update and delete handlers
  const handleUpdateSchedule = async (id: string, updates: any) => {
    console.log('Update schedule:', id, updates);
  };

  const handleDeleteSchedule = async (id: string) => {
    console.log('Delete schedule:', id);
  };

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
        selectedYear={selectedDate.getFullYear()}
        selectedMonth={selectedDate.getMonth()}
        onYearChange={(year) => {
          const newDate = new Date(overviewDate);
          newDate.setFullYear(year);
          setOverviewDate(newDate);
        }}
        onMonthChange={(month) => {
          const newDate = new Date(overviewDate);
          newDate.setMonth(month);
          setOverviewDate(newDate);
        }}
        generateYears={() => {
          const currentYear = new Date().getFullYear();
          return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
        }}
        generateMonths={() => [
          { value: 0, label: '1月' },
          { value: 1, label: '2月' },
          { value: 2, label: '3月' },
          { value: 3, label: '4月' },
          { value: 4, label: '5月' },
          { value: 5, label: '6月' },
          { value: 6, label: '7月' },
          { value: 7, label: '8月' },
          { value: 8, label: '9月' },
          { value: 9, label: '10月' },
          { value: 10, label: '11月' },
          { value: 11, label: '12月' },
        ]}
        onOverviewDateChange={setOverviewDate}
      />

      {/* 月度排班視圖 */}
      <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl overflow-hidden">
        <MonthlyScheduleView
          selectedDate={overviewDate}
          schedules={schedules.filter(schedule => viewableStaffIds.includes(schedule.userId))}
          getUserName={getUserName}
          selectedStaffId={selectedStaffId === 'all' ? undefined : selectedStaffId}
          onUpdateSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          timeSlots={mockTimeSlots}
        />
      </div>
    </div>
  );
};

export default MonthlyTabContent;
