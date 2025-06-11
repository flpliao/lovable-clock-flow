
import React from 'react';
import { Calendar, Users, List, User } from 'lucide-react';
import MonthlyScheduleView from './MonthlyScheduleView';
import StaffMonthSelector from './StaffMonthSelector';

interface ListViewSectionProps {
  availableStaff: any[];
  selectedStaffId: string;
  selectedDate: Date;
  onStaffChange: (staffId: string) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
}

const ListViewSection = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  onDateChange,
  getUserRelation,
  schedules,
  getUserName,
  viewableStaffIds,
}: ListViewSectionProps) => {
  return (
    <div className="space-y-8">
      {/* 員工月份選擇器 */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <User className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">我的詳情</h3>
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
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <List className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white">月度排班</h3>
        </div>
        
        <MonthlyScheduleView
          selectedDate={selectedDate}
          schedules={schedules.filter(schedule => viewableStaffIds.includes(schedule.userId))}
          getUserName={getUserName}
          selectedStaffId={selectedStaffId === 'all' ? undefined : selectedStaffId}
        />
      </div>
    </div>
  );
};

export default ListViewSection;
