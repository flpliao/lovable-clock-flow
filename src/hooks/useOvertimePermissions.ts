
import { useUnifiedPermissions } from './useUnifiedPermissions';
import { OVERTIME_PERMISSIONS } from '@/components/staff/constants/permissions/overtimePermissions';

export const useOvertimePermissions = () => {
  const { hasPermission } = useUnifiedPermissions();

  return {
    canViewOwnOvertime: true, // 所有用戶都能查看自己的記錄
    canCreateOvertime: hasPermission(OVERTIME_PERMISSIONS.CREATE_OVERTIME),
    canViewAllOvertime: hasPermission(OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME),
    canApproveOvertime: hasPermission(OVERTIME_PERMISSIONS.APPROVE_OVERTIME),
    canManageOvertime: hasPermission(OVERTIME_PERMISSIONS.MANAGE_OVERTIME)
  };
};
