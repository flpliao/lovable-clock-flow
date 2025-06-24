import { useCallback, useMemo, useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { UnifiedPermissionService, UnifiedPermissionContext } from '@/services/unifiedPermissionService';
import { StaffRole } from '@/components/staff/types';

export const useUnifiedPermissions = () => {
  const { currentUser } = useUser();
  const { staffList } = useStaffManagementContext();
  const [backendRoles, setBackendRoles] = useState<StaffRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  const permissionService = useMemo(() => 
    UnifiedPermissionService.getInstance(), []
  );

  // 載入後台角色資料
  useEffect(() => {
    const loadBackendRoles = async () => {
      try {
        setRolesLoading(true);
        console.log('🔄 載入後台角色資料用於權限檢查...');
        const roles = await permissionService.getCurrentRoles();
        setBackendRoles(roles);
        console.log('✅ 後台角色資料載入完成:', roles.length, '個角色');
        console.log('📋 角色詳情:', roles.map(r => ({
          id: r.id,
          name: r.name,
          permissionCount: r.permissions.length
        })));
      } catch (error) {
        console.error('❌ 載入後台角色資料失敗:', error);
      } finally {
        setRolesLoading(false);
      }
    };
    
    loadBackendRoles();
  }, [permissionService]);

  // 獲取當前用戶的員工資料
  const currentStaffData = useMemo(() => {
    if (!currentUser) return undefined;
    
    const staff = staffList.find(staff => 
      staff.email === currentUser.name || 
      staff.name === currentUser.name ||
      staff.id === currentUser.id
    );
    
    if (staff) {
      console.log('👤 找到當前用戶員工資料:', {
        name: staff.name,
        roleId: staff.role_id,
        role: staff.role
      });
    } else {
      console.log('⚠️ 未找到當前用戶員工資料:', currentUser.name);
    }
    
    return staff;
  }, [currentUser, staffList]);

  // 構建權限檢查上下文（使用後台角色資料）
  const permissionContext = useMemo((): UnifiedPermissionContext => ({
    currentUser,
    staffData: currentStaffData,
    roles: backendRoles // 使用後台載入的角色資料
  }), [currentUser, currentStaffData, backendRoles]);

  // 統一權限檢查函數
  const hasPermission = useCallback((permission: string): boolean => {
    if (rolesLoading) {
      console.log('⏳ 角色資料載入中，暫時拒絕權限:', permission);
      return false;
    }
    
    const result = permissionService.hasPermission(permission, permissionContext);
    console.log('🔐 統一權限檢查:', {
      user: currentUser?.name,
      permission,
      result,
      rolesCount: backendRoles.length,
      staffData: currentStaffData ? '有' : '無'
    });
    return result;
  }, [permissionService, permissionContext, currentUser, backendRoles, rolesLoading, currentStaffData]);

  // 批量權限檢查
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  }, [hasPermission]);

  // 檢查所有權限
  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  // 角色檢查（基於動態權限）
  const isAdmin = useCallback((): boolean => {
    // 檢查是否有系統管理權限
    return hasPermission('system:manage') || hasPermission('system:settings_edit');
  }, [hasPermission]);

  const isManager = useCallback((): boolean => {
    // 檢查是否有管理相關權限
    return hasPermission('staff:manage') || hasPermission('attendance:manage') || isAdmin();
  }, [hasPermission, isAdmin]);

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
      setRolesLoading(true);
      const roles = await permissionService.getCurrentRoles();
      setBackendRoles(roles);
      permissionService.clearCache();
      console.log('✅ 後台角色資料重新載入完成');
    } catch (error) {
      console.error('❌ 重新載入後台角色資料失敗:', error);
    } finally {
      setRolesLoading(false);
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
    backendRoles,
    rolesLoading // 新增載入狀態
  };
};
