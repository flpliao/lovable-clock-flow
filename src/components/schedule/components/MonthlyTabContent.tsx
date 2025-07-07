import { Schedule } from '@/contexts/scheduling';
import { Users } from 'lucide-react';
import MonthSelectorCard from './MonthSelectorCard';
import StaffSelectorCard from './StaffSelectorCard';

interface Staff {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface MonthlyTabContentProps {
  availableStaff: Staff[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  getUserRelation: (userId: string) => string;
  schedules: Schedule[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
}

const MonthlyTabContent = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  getUserRelation,
}: MonthlyTabContentProps) => {
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

      {/* 選擇月份 Card */}
      <MonthSelectorCard
        selectedYear={selectedDate.getFullYear()}
        selectedMonth={selectedDate.getMonth() + 1}
        onYearChange={() => {}} // 空函數，因為這個組件可能不需要實際功能
        onMonthChange={() => {}} // 空函數，因為這個組件可能不需要實際功能
        generateYears={() => {
          const currentYear = new Date().getFullYear();
          return Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
        }}
        generateMonths={() => [
          { value: 1, label: '1月' },
          { value: 2, label: '2月' },
          { value: 3, label: '3月' },
          { value: 4, label: '4月' },
          { value: 5, label: '5月' },
          { value: 6, label: '6月' },
          { value: 7, label: '7月' },
          { value: 8, label: '8月' },
          { value: 9, label: '9月' },
          { value: 10, label: '10月' },
          { value: 11, label: '11月' },
          { value: 12, label: '12月' },
        ]}
      />
    </div>
  );
};

export default MonthlyTabContent;
