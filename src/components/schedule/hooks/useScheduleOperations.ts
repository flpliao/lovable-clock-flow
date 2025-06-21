
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useScheduleOperations = () => {
  const { schedules, removeSchedule } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser, hasPermission } = useUser();
  const { toast } = useToast();

  // 獲取可查看的員工列表
  const getAvailableStaff = () => {
    if (!currentUser) return [];
    
    const availableStaff = [];
    
    // 如果有查看所有排班權限，返回所有員工
    if (hasPermission('schedule:view_all')) {
      return staffList;
    }
    
    // 否則只返回自己
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
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
    if (hasPermission('schedule:view_all') && getSubordinates(currentUser.id).some(s => s.id === userId)) {
      return '（下屬）';
    }
    return '';
  };

  // 刪除排班
  const handleRemoveSchedule = (scheduleId: string) => {
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

  // 檢查是否可以刪除排班
  const canDeleteSchedule = (schedule: any) => {
    if (!currentUser) return false;
    
    // 系統管理員可以刪除所有排班
    if (hasPermission('schedule:delete')) {
      return true;
    }
    
    // 一般用戶無法刪除排班
    return false;
  };

  // 檢查權限
  const canCreateSchedule = hasPermission('schedule:create');
  const canEditSchedule = hasPermission('schedule:edit');
  const canViewAllSchedules = hasPermission('schedule:view_all');
  const hasSubordinates = canViewAllSchedules && getSubordinates(currentUser?.id || '').length > 0;

  return {
    schedules,
    currentUser,
    getAvailableStaff,
    getUserName,
    getUserRelation,
    handleRemoveSchedule,
    canDeleteSchedule,
    hasSubordinates,
    canCreateSchedule,
    canEditSchedule,
    canViewAllSchedules,
  };
};
