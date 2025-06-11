
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
    <div className="space-y-8">
      {/* 員工月份選擇器 */}
      <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg border border-white/30">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">我的詳情</h3>
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
      <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg border border-white/30">
            <List className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 drop-shadow-sm">月度排班</h3>
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
