import { StaffRole } from '@/components/staff/types';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useCurrentUser } from '@/hooks/useStores';
import { UnifiedPermissionContext, UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useUnifiedPermissions = () => {
  const currentUser = useCurrentUser();
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

  // 獲取當前用戶的員工資料（優先使用 role_id）
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
        currentUserRole: currentUser.role_id
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

  // 角色檢查（嚴格基於 currentUser?.role_id）
  const isAdmin = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // 嚴格檢查 currentUser?.role_id 是否為 admin
    const result = currentUser?.role_id === 'admin';
    
    console.log('🔐 統一權限系統 - Admin 檢查:', {
      user: currentUser.name,
      role_id: currentUser?.role_id,
      result
    });
    
    return result;
  }, [currentUser]);

  const isManager = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // 嚴格基於 currentUser?.role_id 進行權限檢查
    const result = currentUser?.role_id === 'manager' || isAdmin();
    
    console.log('🔐 統一權限系統 - Manager 檢查:', {
      user: currentUser.name,
      role: currentUser?.role_id,
      result
    });
    
    return result;
  }, [currentUser, isAdmin]);

  const clearPermissionCache = useCallback(() => {
    permissionService.clearCache();
  }, [permissionService]);

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

  // 清理不存在的方法呼叫
  useEffect(() => {
    const handleForceReload = () => {
      console.log('🔄 收到強制重新載入事件');
      clearPermissionCache();
      reloadBackendRoles();
    };

    window.addEventListener('permissionForceReload', handleForceReload);

    return () => {
      window.removeEventListener('permissionForceReload', handleForceReload);
    };
  }, [clearPermissionCache, reloadBackendRoles]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    clearPermissionCache,
    reloadBackendRoles,
    currentStaffData,
    permissionContext,
    backendRoles,
    rolesLoading
  };
};
