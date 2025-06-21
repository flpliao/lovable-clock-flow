
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScheduleDragDrop } from '../hooks/useScheduleDragDrop';
import { useScheduleDialogs } from '../hooks/useScheduleDialogs';
import { useExtendedCalendar } from '../hooks/useExtendedCalendar';
import MonthlyCalendarGrid from './MonthlyCalendarGrid';
import EditScheduleDialog from './EditScheduleDialog';
import DayScheduleDialog from './DayScheduleDialog';

interface MonthlyScheduleViewProps {
  selectedDate: Date;
  schedules: any[];
  getUserName: (userId: string) => string;
  selectedStaffId?: string;
  onUpdateSchedule: (id: string, updates: any) => Promise<void>;
  onDeleteSchedule: (id: string) => Promise<void>;
  timeSlots: Array<{
    id: string;
    name: string;
    start_time: string;
    end_time: string;
  }>;
}

const MonthlyScheduleView = ({ 
  selectedDate, 
  schedules, 
  getUserName, 
  selectedStaffId,
  onUpdateSchedule,
  onDeleteSchedule,
  timeSlots = []
}: MonthlyScheduleViewProps) => {
  const navigate = useNavigate();
  
  const {
    sensors,
    dragSchedules,
    hasScheduleConflict,
    handleDragStart,
    handleDragEnd,
    activeSchedule
  } = useScheduleDragDrop({
    schedules,
    selectedStaffId,
    onUpdateSchedule
  });

  const {
    selectedSchedule,
    isEditDialogOpen,
    isDayDialogOpen,
    selectedDaySchedules,
    selectedDayDate,
    handleScheduleClick,
    handleShowAllSchedules,
    closeEditDialog,
    closeDayDialog
  } = useScheduleDialogs();

  const { 
    isExtended, 
    hasStartExtension, 
    hasEndExtension, 
    extendedStartDate, 
    extendedEndDate 
  } = useExtendedCalendar(selectedDate);

  const handleUpdateSchedule = async (scheduleId: string, updates: any) => {
    await onUpdateSchedule(scheduleId, updates);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    await onDeleteSchedule(scheduleId);
  };

  const getDisplayTitle = () => {
    const baseTitle = format(selectedDate, 'yyyy年MM月', { locale: zhTW });
    
    if (isExtended) {
      let extendedInfo = '';
      
      if (hasStartExtension && hasEndExtension) {
        extendedInfo = ` (${format(extendedStartDate, 'MM月dd日', { locale: zhTW })} - ${format(extendedEndDate, 'MM月dd日', { locale: zhTW })})`;
      } else if (hasStartExtension) {
        extendedInfo = ` (自 ${format(extendedStartDate, 'MM月dd日', { locale: zhTW })})`;
      } else if (hasEndExtension) {
        extendedInfo = ` (至 ${format(extendedEndDate, 'MM月dd日', { locale: zhTW })})`;
      }
      
      return `${baseTitle}${extendedInfo}`;
    }
    
    return baseTitle;
  };

  const getExtendedDescription = () => {
    if (!isExtended) return null;
    
    if (hasStartExtension && hasEndExtension) {
      return '✨ 完整週顯示（含上個月末及下個月初）';
    } else if (hasStartExtension) {
      return '✨ 完整週顯示（含上個月末）';
    } else if (hasEndExtension) {
      return '✨ 完整週顯示（含下個月初）';
    }
    
    return null;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg">
                {getDisplayTitle()} 排班總覽
                {selectedStaffId && (
                  <span className="ml-2 text-sm sm:text-base text-gray-600">
                    - {getUserName(selectedStaffId)}
                  </span>
                )}
                {getExtendedDescription() && (
                  <div className="mt-1 text-sm text-blue-600">
                    {getExtendedDescription()}
                  </div>
                )}
              </CardTitle>
            </div>
            <Button
              onClick={() => navigate('/schedule-statistics')}
              variant="outline"
              size="sm"
              className="ml-4 flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">統計資訊</span>
              <span className="sm:hidden">統計</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MonthlyCalendarGrid
            selectedDate={selectedDate}
            sensors={sensors}
            dragSchedules={dragSchedules}
            hasScheduleConflict={hasScheduleConflict}
            getUserName={getUserName}
            selectedSchedule={selectedSchedule}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleScheduleClick={handleScheduleClick}
            handleShowAllSchedules={handleShowAllSchedules}
            activeSchedule={activeSchedule}
          />
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditScheduleDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        schedule={selectedSchedule}
        timeSlots={timeSlots}
        getUserName={getUserName}
        onUpdate={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
      />

      {/* Day Schedule Dialog */}
      <DayScheduleDialog
        isOpen={isDayDialogOpen}
        onClose={closeDayDialog}
        date={selectedDayDate}
        schedules={selectedDaySchedules}
        getUserName={getUserName}
        onScheduleClick={handleScheduleClick}
      />
    </>
  );
};

export default MonthlyScheduleView;
