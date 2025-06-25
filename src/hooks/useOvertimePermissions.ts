
import { useUnifiedPermissions } from './useUnifiedPermissions';
import { OVERTIME_PERMISSIONS } from '@/components/staff/constants/permissions/overtimePermissions';

export const useOvertimePermissions = () => {
  const { hasPermission, isAdmin, isManager, currentStaffData } = useUnifiedPermissions();

  return {
    // 基本權限 - 所有用戶都能查看自己的記錄
    canViewOwnOvertime: true,
    canCreateOvertime: hasPermission(OVERTIME_PERMISSIONS.CREATE_OVERTIME),
    canUpdateOwnOvertime: hasPermission(OVERTIME_PERMISSIONS.UPDATE_OWN_OVERTIME),
    canDeleteOwnOvertime: hasPermission(OVERTIME_PERMISSIONS.DELETE_OWN_OVERTIME),
    
    // 審核權限
    canApproveOvertime: hasPermission(OVERTIME_PERMISSIONS.APPROVE_OVERTIME) || isManager() || isAdmin(),
    canViewSubordinateOvertime: hasPermission(OVERTIME_PERMISSIONS.VIEW_SUBORDINATE_OVERTIME) || isManager() || isAdmin(),
    
    // 管理權限
    canViewAllOvertime: hasPermission(OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME) || isAdmin(),
    canManageOvertime: hasPermission(OVERTIME_PERMISSIONS.MANAGE_OVERTIME) || isAdmin(),
    canExportOvertime: hasPermission(OVERTIME_PERMISSIONS.EXPORT_OVERTIME) || isAdmin(),
    
    // 報表權限
    canViewOvertimeReports: hasPermission(OVERTIME_PERMISSIONS.VIEW_OVERTIME_REPORTS) || isManager() || isAdmin(),
    canManageOvertimeReports: hasPermission(OVERTIME_PERMISSIONS.MANAGE_OVERTIME_REPORTS) || isAdmin(),
    
    // 特殊權限檢查
    isAdmin: isAdmin(),
    isManager: isManager(),
    staffData: currentStaffData,
    
    // 綜合權限檢查
    hasAnyOvertimePermission: 
      hasPermission(OVERTIME_PERMISSIONS.CREATE_OVERTIME) ||
      hasPermission(OVERTIME_PERMISSIONS.APPROVE_OVERTIME) ||
      hasPermission(OVERTIME_PERMISSIONS.VIEW_ALL_OVERTIME) ||
      hasPermission(OVERTIME_PERMISSIONS.MANAGE_OVERTIME) ||
      isManager() || isAdmin()
  };
};
