
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useScheduling } from '@/contexts/SchedulingContext';
import { format } from 'date-fns';

export const useScheduleFiltering = (viewMode: 'self' | 'subordinates' | 'all') => {
  const { getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const { getSchedulesForDate } = useScheduling();

  // 獲取可查看的員工ID列表
  const getViewableStaffIds = () => {
    if (!currentUser) return [];
    
    const viewableIds = [];
    
    switch (viewMode) {
      case 'self':
        viewableIds.push(currentUser.id);
        break;
      case 'subordinates':
        if (currentUser.role === 'admin' || currentUser.role === 'manager') {
          const subordinates = getSubordinates(currentUser.id);
          viewableIds.push(...subordinates.map(s => s.id));
        }
        break;
      case 'all':
        viewableIds.push(currentUser.id);
        if (currentUser.role === 'admin' || currentUser.role === 'manager') {
          const subordinates = getSubordinates(currentUser.id);
          viewableIds.push(...subordinates.map(s => s.id));
        }
        break;
    }
    
    return viewableIds;
  };

  const viewableStaffIds = getViewableStaffIds();
  
  // 過濾排班記錄
  const getFilteredSchedulesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const allSchedules = getSchedulesForDate(dateString);
    return allSchedules.filter(schedule => viewableStaffIds.includes(schedule.userId));
  };

  return {
    viewableStaffIds,
    getFilteredSchedulesForDate,
  };
};
