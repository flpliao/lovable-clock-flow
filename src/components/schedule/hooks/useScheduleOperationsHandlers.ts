
import { useScheduling } from '@/contexts/SchedulingContext';
import { useToast } from '@/hooks/use-toast';

export const useScheduleOperationsHandlers = () => {
  const { updateSchedule, removeSchedule } = useScheduling();
  const { toast } = useToast();

  const handleUpdateSchedule = async (id: string, updates: any) => {
    try {
      console.log('useScheduleOperationsHandlers - Updating schedule:', { id, updates });
      
      // 確保更新包含所有必要的欄位
      const updateData: any = {};
      
      if (updates.timeSlot) updateData.timeSlot = updates.timeSlot;
      if (updates.startTime) updateData.startTime = updates.startTime;
      if (updates.endTime) updateData.endTime = updates.endTime;
      if (updates.workDate) updateData.workDate = updates.workDate;
      if (updates.userId) updateData.userId = updates.userId;

      console.log('useScheduleOperationsHandlers - Final update data:', updateData);
      
      await updateSchedule(id, updateData);
      
      console.log('useScheduleOperationsHandlers - Schedule updated successfully');
    } catch (error) {
      console.error('useScheduleOperationsHandlers - Update failed:', error);
      throw error;
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      console.log('useScheduleOperationsHandlers - Deleting schedule:', id);
      await removeSchedule(id);
      console.log('useScheduleOperationsHandlers - Schedule deleted successfully');
    } catch (error) {
      console.error('useScheduleOperationsHandlers - Delete failed:', error);
      throw error;
    }
  };

  return {
    handleUpdateSchedule,
    handleDeleteSchedule
  };
};
