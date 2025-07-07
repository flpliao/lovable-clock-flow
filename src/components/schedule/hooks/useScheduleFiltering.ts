import { Staff } from '@/components/staff/types';
import { Schedule } from '@/contexts/scheduling/types';
import { useCurrentUser } from '@/hooks/useStores';
import { permissionService } from '@/services/simplifiedPermissionService';
import { useMemo } from 'react';

interface UseScheduleFilteringProps {
  viewMode: 'all' | 'own' | 'subordinates';
  staffList: Staff[];
  getSubordinates: (userId: string) => Staff[];
  schedules: Schedule[];
}

export const useScheduleFiltering = ({
  viewMode,
  staffList,
  getSubordinates,
  schedules,
}: UseScheduleFilteringProps) => {
  const currentUser = useCurrentUser();

  // 計算可查看的員工ID列表
  const viewableStaffIds = useMemo(() => {
    if (!currentUser) return [];

    const canViewAllSchedules = permissionService.hasPermission('schedule:view_all');
    const canViewOwnSchedules = permissionService.hasPermission('schedule:view_own');

    if (canViewAllSchedules) {
      // 有查看所有排班權限
      switch (viewMode) {
        case 'all':
          return staffList.map(staff => staff.id);
        case 'own':
          return [currentUser.id];
        case 'subordinates':
          return getSubordinates(currentUser.id).map(staff => staff.id);
        default:
          return staffList.map(staff => staff.id);
      }
    } else if (canViewOwnSchedules) {
      // 只有查看自己排班權限
      const ownIds = [currentUser.id];
      const subordinateIds = getSubordinates(currentUser.id).map(staff => staff.id);
      return [...ownIds, ...subordinateIds];
    } else {
      // 沒有權限
      return [];
    }
  }, [currentUser, viewMode, staffList, getSubordinates]);

  // 取得指定日期的排班記錄
  const getFilteredSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.filter(
      schedule => schedule.workDate === dateString && viewableStaffIds.includes(schedule.userId)
    );
  };

  return {
    viewableStaffIds,
    getFilteredSchedulesForDate,
  };
};
