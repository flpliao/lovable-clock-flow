
import React from 'react';
import { Calendar, Users, List } from 'lucide-react';
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
    <div className="space-y-6">
      {/* 員工月份選擇器 */}
      <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-lg text-white">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">我的詳情</h3>
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
      <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-teal-500 rounded-lg text-white">
            <List className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">月度排班</h3>
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
