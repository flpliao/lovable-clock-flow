
import React from 'react';
import MonthlyScheduleView from './MonthlyScheduleView';

interface MonthlyTabContentProps {
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId?: string) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
  schedules: any[];
  getUserName: (userId: string) => string;
  viewableStaffIds: string[];
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (id: string) => Promise<void>;
  currentUser: any;
}

const MonthlyTabContent = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  onDateChange,
  getUserRelation,
  schedules,
  getUserName,
  viewableStaffIds,
  canDeleteSchedule,
  onRemoveSchedule,
  currentUser,
}: MonthlyTabContentProps) => {
  // 過濾當月的排班記錄
  const monthlySchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.workDate);
    return scheduleDate.getMonth() === selectedDate.getMonth() && 
           scheduleDate.getFullYear() === selectedDate.getFullYear();
  });

  const handleUpdateSchedule = async (id: string, updates: any) => {
    // 這裡應該調用實際的更新邏輯
    console.log('Update schedule:', id, updates);
  };

  const handleDeleteSchedule = async (id: string) => {
    await onRemoveSchedule(id);
  };

  return (
    <div className="space-y-6">
      {/* 員工選擇器 */}
      <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStaffChange(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !selectedStaffId 
                ? 'bg-white/40 text-white border border-white/50' 
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            全部員工
          </button>
          {availableStaff.map(staff => (
            <button
              key={staff.id}
              onClick={() => onStaffChange(staff.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedStaffId === staff.id 
                  ? 'bg-white/40 text-white border border-white/50' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {getUserName(staff.id)}
              <span className="ml-1 text-xs opacity-70">
                ({getUserRelation(staff.id)})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 月度排班視圖 */}
      <MonthlyScheduleView
        selectedDate={selectedDate}
        schedules={monthlySchedules}
        getUserName={getUserName}
        selectedStaffId={selectedStaffId}
        onUpdateSchedule={handleUpdateSchedule}
        onDeleteSchedule={handleDeleteSchedule}
        onDateChange={onDateChange}
        timeSlots={[]}
      />
    </div>
  );
};

export default MonthlyTabContent;
