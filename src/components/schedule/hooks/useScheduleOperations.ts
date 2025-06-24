
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';

export const useScheduleOperations = () => {
  const { schedules, removeSchedule } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const { toast } = useToast();
  const { hasPermission } = useUnifiedPermissions();

  // 獲取可查看的員工列表
  const getAvailableStaff = () => {
    if (!currentUser) return [];
    
    const availableStaff = [];
    
    // 如果有查看所有排班權限，返回所有員工
    if (hasPermission('schedule:view_all')) {
      return staffList;
    }
    
    // 否則返回自己和下屬
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
    // 加入下屬員工
    const subordinates = getSubordinates(currentUser.id);
    availableStaff.push(...subordinates);
    
    return availableStaff;
  };

  // 獲取用戶名稱
  const getUserName = (userId: string) => {
    const user = staffList.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  // 獲取用戶關係標記
  const getUserRelation = (userId: string) => {
    if (!currentUser) return '';
    if (userId === currentUser.id) return '（自己）';
    
    const subordinates = getSubordinates(currentUser.id);
    if (subordinates.some(s => s.id === userId)) {
      return '（下屬）';
    }
    
    if (hasPermission('schedule:view_all')) {
      return '';
    }
    
    return '';
  };

  // 刪除排班
  const handleRemoveSchedule = async (scheduleId: string) => {
    // 檢查刪除權限
    if (!hasPermission('schedule:delete')) {
      toast({
        title: '權限不足',
        description: '您沒有權限刪除排班記錄',
        variant: "destructive",
      });
      return;
    }

    removeSchedule(scheduleId);
    toast({
      title: '刪除成功',
      description: '排班記錄已刪除',
    });
  };

  // 檢查是否可以刪除排班 - 改為同步函數
  const canDeleteSchedule = (schedule: any): boolean => {
    if (!currentUser) return false;
    
    // 系統管理員可以刪除所有排班
    if (hasPermission('schedule:delete')) {
      return true;
    }
    
    // 主管可以刪除下屬的排班
    const subordinates = getSubordinates(currentUser.id);
    if (subordinates.some(s => s.id === schedule.userId)) {
      return true;
    }
    
    // 可以刪除自己的排班（如果有相應權限）
    if (schedule.userId === currentUser.id) {
      return true;
    }
    
    return false;
  };

  // 檢查權限
  const canCreateSchedule = hasPermission('schedule:create') || getSubordinates(currentUser?.id || '').length > 0;
  const canEditSchedule = hasPermission('schedule:edit') || getSubordinates(currentUser?.id || '').length > 0;
  const canViewAllSchedules = hasPermission('schedule:view_all');
  const hasSubordinates = getSubordinates(currentUser?.id || '').length > 0;

  return {
    schedules,
    currentUser,
    getAvailableStaff,
    getUserName,
    getUserRelation,
    handleRemoveSchedule,
    canDeleteSchedule,
    hasSubordinates: hasSubordinates || canViewAllSchedules,
    canCreateSchedule,
    canEditSchedule,
    canViewAllSchedules,
  };
};
