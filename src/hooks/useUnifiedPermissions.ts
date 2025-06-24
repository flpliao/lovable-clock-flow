
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { UnifiedPermissionService, UnifiedPermissionContext } from '@/services/unifiedPermissionService';
import { StaffRole } from '@/components/staff/types';

export const useUnifiedPermissions = () => {
  const { currentUser } = useUser();
  const { staffList } = useStaffManagementContext();
  const [backendRoles, setBackendRoles] = useState<StaffRole[]>([]);
  
  const permissionService = useMemo(() => 
    UnifiedPermissionService.getInstance(), []
  );

  // 載入後台角色資料
  useEffect(() => {
    const loadBackendRoles = async () => {
      try {
        console.log('🔄 載入後台角色資料用於權限檢查...');
        const roles = await permissionService.getCurrentRoles();
        setBackendRoles(roles);
        console.log('✅ 後台角色資料載入完成:', roles.length, '個角色');
      } catch (error) {
        console.error('❌ 載入後台角色資料失敗:', error);
      }
    };
    
    loadBackendRoles();
  }, [permissionService]);

  // 獲取當前用戶的員工資料
  const currentStaffData = useMemo(() => {
    if (!currentUser) return undefined;
    return staffList.find(staff => 
      staff.email === currentUser.name || 
      staff.name === currentUser.name ||
      staff.id === currentUser.id
    );
  }, [currentUser, staffList]);

  // 構建權限檢查上下文（使用後台角色資料）
  const permissionContext = useMemo((): UnifiedPermissionContext => ({
    currentUser,
    staffData: currentStaffData,
    roles: backendRoles // 使用後台載入的角色資料
  }), [currentUser, currentStaffData, backendRoles]);

  // 統一權限檢查函數
  const hasPermission = useCallback((permission: string): boolean => {
    const result = permissionService.hasPermission(permission, permissionContext);
    console.log('🔐 統一權限檢查:', {
      user: currentUser?.name,
      permission,
      result,
      rolesCount: backendRoles.length
    });
    return result;
  }, [permissionService, permissionContext, currentUser, backendRoles]);

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

  // 重新載入後台角色資料
  const reloadBackendRoles = useCallback(async () => {
    try {
      console.log('🔄 重新載入後台角色資料...');
      const roles = await permissionService.getCurrentRoles();
      setBackendRoles(roles);
      permissionService.clearCache();
      console.log('✅ 後台角色資料重新載入完成');
    } catch (error) {
      console.error('❌ 重新載入後台角色資料失敗:', error);
    }
  }, [permissionService]);

  // 監聽權限更新事件
  useEffect(() => {
    const removeListener = permissionService.addPermissionUpdateListener(() => {
      console.log('🔔 權限更新，觸發重新檢查');
      clearPermissionCache();
      reloadBackendRoles(); // 重新載入後台角色資料
    });

    // 監聽強制重新載入事件
    const handleForceReload = () => {
      console.log('🔄 收到強制重新載入事件');
      clearPermissionCache();
      reloadBackendRoles();
    };

    window.addEventListener('permissionForceReload', handleForceReload);

    return () => {
      removeListener();
      window.removeEventListener('permissionForceReload', handleForceReload);
    };
  }, [permissionService, clearPermissionCache, reloadBackendRoles]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    clearPermissionCache,
    clearCurrentUserCache,
    reloadBackendRoles,
    currentStaffData,
    permissionContext,
    backendRoles // 提供後台角色資料
  };
};
