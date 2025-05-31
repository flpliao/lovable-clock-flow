
import { useMemo } from 'react';

// 安全地使用 StaffManagementContext
export const useStaffManagementSafe = () => {
  return useMemo(() => {
    try {
      // 動態導入 context hook
      const { useStaffManagementContext } = require('@/contexts/StaffManagementContext');
      return useStaffManagementContext();
    } catch (error) {
      console.log('⚠️ StaffManagementContext 不可用，返回空數據');
      return { staffList: [] };
    }
  }, []);
};
