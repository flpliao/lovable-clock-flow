import { useStaffStore } from '@/stores/staffStore';
import { useMemo } from 'react';
import { Staff } from '../types';

export const useSupervisorFilter = (currentStaff: Staff | null) => {
  const { staff } = useStaffStore();

  const potentialSupervisors = useMemo(() => {
    if (!currentStaff || !staff) {
      return [];
    }

    // 篩選條件：
    // 1. 排除自己
    // 2. 只顯示同部門的人員
    // 3. 排除已離職的人員（如果有 status 欄位）
    return staff.filter(s => {
      // 排除自己
      if (s.id === currentStaff.id) {
        return false;
      }

      // 只顯示同部門的人員
      if (s.branch_id !== currentStaff.branch_id) {
        return false;
      }

      return true;
    });
  }, [currentStaff, staff]);

  return potentialSupervisors;
};
