import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { Staff } from '../types';
import { useMemo } from 'react';

export const useSupervisorFilter = (currentStaff: Staff | null) => {
  const { staffList } = useStaffManagementContext();

  const potentialSupervisors = useMemo(() => {
    if (!currentStaff || !staffList) {
      return [];
    }

    // 篩選條件：
    // 1. 排除自己
    // 2. 只顯示同部門的人員
    // 3. 排除已離職的人員（如果有 status 欄位）
    return staffList.filter(staff => {
      // 排除自己
      if (staff.id === currentStaff.id) {
        return false;
      }

      // 只顯示同部門的人員
      if (staff.department !== currentStaff.department) {
        return false;
      }

      return true;
    });
  }, [currentStaff, staffList]);

  return potentialSupervisors;
};
