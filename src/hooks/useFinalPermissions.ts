import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { useCurrentUser } from './useCurrentUser';

/**
 * 最終版權限 Hook - 使用新的資料庫函數
 */
export const useFinalPermissions = () => {
  const { currentUser: user } = useCurrentUser();

  const hasPermission = (permission: string): boolean => {
    if (!user) {
      console.log('🔐 用戶未登入，權限檢查失敗');
      return false;
    }

    // 系統管理員權限檢查
    if (user.role_id === 'admin') {
      console.log('🔐 系統管理員權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 基本用戶權限：所有用戶都可以查看自己的記錄和申請
    const basicPermissions = [
      'staff:view_own',
      'staff:edit_own',
      'leave:view_own',
      'leave:create',
      'overtime:view_own',
      'overtime:create',
      'missed_checkin:view_own',
      'missed_checkin:create',
      'announcement:view',
      'department:view',
      'company:view',
    ];

    if (basicPermissions.includes(permission)) {
      console.log('🔐 基本用戶權限檢查:', user.name, permission, '✅ 允許');
      return true;
    }

    console.log('🔐 權限檢查失敗:', user.name, permission, '❌ 拒絕');
    return false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasPermissionAsync = async (permission: string): Promise<boolean> => {
    try {
      const permissionService = UnifiedPermissionService.getInstance();
      return await permissionService.hasPermissionAsync(permission);
    } catch (error) {
      console.error('❌ 異步權限檢查錯誤:', error);
      return hasPermission(permission);
    }
  };

  const isAdmin = (): boolean => {
    if (!user) {
      console.log('🔐 用戶未登入，Admin 檢查失敗');
      return false;
    }

    // 檢查角色
    const isRoleAdmin = user.role_id === 'admin';

    console.log('🔐 Admin permission check:', {
      userName: user.name,
      userId: user.id,
      role: user.role_id,
      isRoleAdmin,
      result: isRoleAdmin,
    });

    return isRoleAdmin;
  };

  const isManager = (): boolean => {
    if (!user) {
      console.log('🔐 用戶未登入，Manager 檢查失敗');
      return false;
    }

    // 管理員也是主管
    if (isAdmin()) {
      return true;
    }

    // 檢查角色 - 修正類型問題
    const isRoleManager = user.role_id === 'manager';

    console.log('🔐 Manager permission check:', {
      userName: user.name,
      role: user.role_id,
      isRoleManager,
      result: isRoleManager,
    });

    return isRoleManager;
  };

  const clearPermissionCache = () => {
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionAsync,
    isAdmin,
    isManager,
    clearPermissionCache,
    currentUser: user,
  };
};
