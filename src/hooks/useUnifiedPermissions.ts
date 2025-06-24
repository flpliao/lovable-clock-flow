
import { useCallback, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { UnifiedPermissionService, UnifiedPermissionContext } from '@/services/unifiedPermissionService';

export const useUnifiedPermissions = () => {
  const { currentUser } = useUser();
  const { roles, staffList } = useStaffManagementContext();
  
  const permissionService = useMemo(() => 
    UnifiedPermissionService.getInstance(), []
  );

  // 獲取當前用戶的員工資料
  const currentStaffData = useMemo(() => {
    if (!currentUser) return undefined;
    return staffList.find(staff => 
      staff.email === currentUser.name || 
      staff.name === currentUser.name ||
      staff.id === currentUser.id
    );
  }, [currentUser, staffList]);

  // 構建權限檢查上下文
  const permissionContext = useMemo((): UnifiedPermissionContext => ({
    currentUser,
    staffData: currentStaffData,
    roles
  }), [currentUser, currentStaffData, roles]);

  // 統一權限檢查函數
  const hasPermission = useCallback((permission: string): boolean => {
    return permissionService.hasPermission(permission, permissionContext);
  }, [permissionService, permissionContext]);

  // 批量權限檢查
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  // 檢查所有權限
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  // 角色檢查（保持向後兼容）
  const isAdmin = useCallback((): boolean => {
    return hasPermission('admin:all') || currentUser?.role === 'admin';
  }, [hasPermission, currentUser]);

  const isManager = useCallback((): boolean => {
    return hasPermission('manager:all') || currentUser?.role === 'manager' || isAdmin();
  }, [hasPermission, currentUser, isAdmin]);

  // 清除權限快取
  const clearPermissionCache = useCallback(() => {
    permissionService.clearCache();
  }, [permissionService]);

  // 清除當前用戶權限快取
  const clearCurrentUserCache = useCallback(() => {
    if (currentUser?.id) {
      permissionService.clearUserCache(currentUser.id);
    }
  }, [currentUser, permissionService]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    clearPermissionCache,
    clearCurrentUserCache,
    currentStaffData,
    permissionContext
  };
};
