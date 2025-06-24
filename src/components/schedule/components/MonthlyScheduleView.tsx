
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScheduleDialogs } from '../hooks/useScheduleDialogs';
import { useExtendedCalendar } from '../hooks/useExtendedCalendar';
import { useScheduleOperationsHandlers } from '../hooks/useScheduleOperationsHandlers';
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
  const { handleUpdateSchedule, handleDeleteSchedule } = useScheduleOperationsHandlers();
  
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

  // 使用統一的處理器來確保更新正確傳遞
  const handleScheduleUpdate = async (scheduleId: string, updates: any) => {
    console.log('MonthlyScheduleView - Schedule update requested:', { scheduleId, updates });
    try {
      await handleUpdateSchedule(scheduleId, updates);
      // 強制重新整理排班資料（如果需要的話）
      if (onUpdateSchedule) {
        await onUpdateSchedule(scheduleId, updates);
      }
    } catch (error) {
      console.error('MonthlyScheduleView - Schedule update failed:', error);
      throw error;
    }
  };

  const handleScheduleDelete = async (scheduleId: string) => {
    console.log('MonthlyScheduleView - Schedule delete requested:', scheduleId);
    try {
      await handleDeleteSchedule(scheduleId);
      // 強制重新整理排班資料（如果需要的話）
      if (onDeleteSchedule) {
        await onDeleteSchedule(scheduleId);
      }
    } catch (error) {
      console.error('MonthlyScheduleView - Schedule delete failed:', error);
      throw error;
    }
  };

  const getDisplayTitle = () => {
    const baseTitle = format(selectedDate, 'yyyy年MM月', {
      locale: zhTW
    });

    if (isExtended) {
      let extendedInfo = '';
      if (hasStartExtension && hasEndExtension) {
        extendedInfo = ` (${format(extendedStartDate, 'MM月dd日', {
          locale: zhTW
        })} - ${format(extendedEndDate, 'MM月dd日', {
          locale: zhTW
        })})`;
      } else if (hasStartExtension) {
        extendedInfo = ` (自 ${format(extendedStartDate, 'MM月dd日', {
          locale: zhTW
        })})`;
      } else if (hasEndExtension) {
        extendedInfo = ` (至 ${format(extendedEndDate, 'MM月dd日', {
          locale: zhTW
        })})`;
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
      <div className="backdrop-blur-2xl bg-white/8 border border-white/20 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2 drop-shadow-sm">
              {getDisplayTitle()} 排班總覽
              {selectedStaffId && (
                <span className="ml-2 text-lg text-gray-800">
                  - {getUserName(selectedStaffId)}
                </span>
              )}
            </h2>
            {getExtendedDescription() && (
              <div className="text-sm text-gray-700">
                {getExtendedDescription()}
              </div>
            )}
          </div>
          <Button
            onClick={() => navigate('/schedule-statistics')}
            variant="outline"
            size="sm"
            className="ml-4 flex items-center gap-2 bg-cyan-100/40 border-cyan-200/50 text-gray-800 hover:bg-cyan-100/60 hover:text-gray-900 backdrop-blur-xl shadow-md"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">統計資訊</span>
            <span className="sm:hidden">統計</span>
          </Button>
        </div>
        
        <MonthlyCalendarGrid
          selectedDate={selectedDate}
          schedules={schedules}
          getUserName={getUserName}
          selectedSchedule={selectedSchedule}
          handleScheduleClick={handleScheduleClick}
          handleShowAllSchedules={handleShowAllSchedules}
        />
      </div>

      {/* Edit Dialog */}
      <EditScheduleDialog
        isOpen={isEditDialogOpen}
        onClose={closeEditDialog}
        schedule={selectedSchedule}
        getUserName={getUserName}
        onUpdate={handleScheduleUpdate}
        onDelete={handleScheduleDelete}
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
