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
  viewableStaffIds
}: ListViewSectionProps) => {
  // Mock time slots for the monthly view
  const mockTimeSlots = [{
    id: '1',
    name: '早班',
    start_time: '08:00',
    end_time: '16:00'
  }, {
    id: '2',
    name: '中班',
    start_time: '16:00',
    end_time: '24:00'
  }, {
    id: '3',
    name: '晚班',
    start_time: '00:00',
    end_time: '08:00'
  }];

  // Mock update and delete handlers
  const handleUpdateSchedule = async (id: string, updates: any) => {
    console.log('Update schedule:', id, updates);
  };
  const handleDeleteSchedule = async (id: string) => {
    console.log('Delete schedule:', id);
  };
  return <div className="space-y-8">
      {/* 員工月份選擇器 */}
      <div className="">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <User className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">我的詳情</h3>
        </div>
        
        <StaffMonthSelector availableStaff={availableStaff} selectedStaffId={selectedStaffId} selectedDate={selectedDate} onStaffChange={onStaffChange} onDateChange={onDateChange} getUserRelation={getUserRelation} />
      </div>
      
      {/* 月度排班視圖 */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <List className="h-7 w-7 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white drop-shadow-lg">月度排班</h3>
        </div>
        
        <MonthlyScheduleView selectedDate={selectedDate} schedules={schedules.filter(schedule => viewableStaffIds.includes(schedule.userId))} getUserName={getUserName} selectedStaffId={selectedStaffId === 'all' ? undefined : selectedStaffId} onUpdateSchedule={handleUpdateSchedule} onDeleteSchedule={handleDeleteSchedule} timeSlots={mockTimeSlots} />
      </div>
    </div>;
};
export default ListViewSection;