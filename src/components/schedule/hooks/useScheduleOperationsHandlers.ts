
import { useScheduling } from '@/contexts/SchedulingContext';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';

export const useScheduleOperationsHandlers = () => {
  const { updateSchedule, removeSchedule } = useScheduling();
  const { toast } = useToast();
  const { currentUser, hasPermission } = useUser();
  const { getSubordinates } = useStaffManagementContext();

  // 檢查是否可以操作指定用戶的排班
  const canManageUserSchedule = (userId: string) => {
    if (!currentUser) return false;
    
    // 系統管理員可以管理所有排班
    if (hasPermission('schedule:manage') || hasPermission('schedule:edit')) {
      return true;
    }
    
    // 檢查是否為下屬
    const subordinates = getSubordinates(currentUser.id);
    const isSubordinate = subordinates.some(subordinate => subordinate.id === userId);
    
    // 管理員可以管理下屬的排班
    if (isSubordinate) {
      return true;
    }
    
    // 用戶只能管理自己的排班
    return userId === currentUser.id;
  };

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
    handleDeleteSchedule,
    canManageUserSchedule
  };
};
