
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useScheduling } from '@/contexts/SchedulingContext';
import { format } from 'date-fns';

export const useScheduleFiltering = (viewMode: 'self' | 'subordinates' | 'all') => {
  const { getSubordinates, staffList } = useStaffManagementContext();
  const { currentUser, hasPermission } = useUser();
  const { getSchedulesForDate } = useScheduling();

  // 獲取可查看的員工ID列表
  const getViewableStaffIds = () => {
    if (!currentUser) return [];
    
    const viewableIds = [];
    
    // 如果有查看所有排班權限
    if (hasPermission('schedule:view_all')) {
      switch (viewMode) {
        case 'self':
          viewableIds.push(currentUser.id);
          break;
        case 'subordinates':
          const subordinates = getSubordinates(currentUser.id);
          viewableIds.push(...subordinates.map(s => s.id));
          break;
        case 'all':
          // 返回所有員工ID
          viewableIds.push(...staffList.map(s => s.id));
          break;
      }
    } else {
      // 一般用戶只能查看自己的排班
      viewableIds.push(currentUser.id);
    }
    
    return viewableIds;
  };

  const viewableStaffIds = getViewableStaffIds();
  
  // 過濾排班記錄
  const getFilteredSchedulesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const allSchedules = getSchedulesForDate(dateString);
    
    // 根據權限過濾排班記錄
    return allSchedules.filter(schedule => viewableStaffIds.includes(schedule.userId));
  };

  return {
    viewableStaffIds,
    getFilteredSchedulesForDate,
  };
};
