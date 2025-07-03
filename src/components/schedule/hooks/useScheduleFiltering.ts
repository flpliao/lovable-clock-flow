import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useCurrentUser, usePermissionChecker } from '@/hooks/useStores';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export const useScheduleFiltering = (viewMode: 'self' | 'subordinates' | 'all') => {
  const { getSubordinates, staffList } = useStaffManagementContext();
  const currentUser = useCurrentUser();
  const { hasPermission } = usePermissionChecker();
  const { getSchedulesForDate } = useScheduling();
  const [viewableStaffIds, setViewableStaffIds] = useState<string[]>([]);

  // 獲取可查看的員工ID列表
  const getViewableStaffIds = async () => {
    if (!currentUser) return [];
    
    const viewableIds = [];
    
    // 如果有查看所有排班權限
    if (await hasPermission('schedule:view_all')) {
      switch (viewMode) {
        case 'self':
          viewableIds.push(currentUser.id);
          break;
        case 'subordinates': {
          const subordinates = getSubordinates(currentUser.id);
          viewableIds.push(...subordinates.map(s => s.id));
          break;
        }
        case 'all':
          // 返回所有員工ID
          viewableIds.push(...staffList.map(s => s.id));
          break;
      }
    } else {
      // 一般用戶可以查看自己的排班
      viewableIds.push(currentUser.id);
      
      // 如果是主管，也可以查看下屬的排班
      const subordinates = getSubordinates(currentUser.id);
      if (subordinates.length > 0) {
        viewableIds.push(...subordinates.map(s => s.id));
      }
    }
    
    return viewableIds;
  };

  useEffect(() => {
    const loadViewableStaffIds = async () => {
      const ids = await getViewableStaffIds();
      setViewableStaffIds(ids);
    };
    loadViewableStaffIds();
  }, [currentUser, viewMode, staffList]);
  
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
