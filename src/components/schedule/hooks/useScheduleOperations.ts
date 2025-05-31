
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useScheduleOperations = () => {
  const { schedules, removeSchedule } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const { toast } = useToast();

  // 獲取可查看的員工列表
  const getAvailableStaff = () => {
    if (!currentUser) return [];
    
    const availableStaff = [];
    
    // 自己
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
    // 下屬
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      const subordinates = getSubordinates(currentUser.id);
      availableStaff.push(...subordinates);
    }
    
    return availableStaff.filter((staff, index, self) => 
      index === self.findIndex(s => s.id === staff.id)
    );
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
    if (getSubordinates(currentUser.id).some(s => s.id === userId)) return '（下屬）';
    return '';
  };

  // 刪除排班
  const handleRemoveSchedule = (scheduleId: string) => {
    removeSchedule(scheduleId);
    toast({
      title: '刪除成功',
      description: '排班記錄已刪除',
    });
  };

  // 檢查是否可以刪除排班
  const canDeleteSchedule = (schedule: any) => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || schedule.userId === currentUser.id;
  };

  // 檢查是否為主管
  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const hasSubordinates = isManager && getSubordinates(currentUser?.id || '').length > 0;

  return {
    schedules,
    currentUser,
    getAvailableStaff,
    getUserName,
    getUserRelation,
    handleRemoveSchedule,
    canDeleteSchedule,
    hasSubordinates,
  };
};
