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

  // 獲取當前用戶的員工資料（改善查找邏輯，基於 user_id）
  const currentStaffData = useMemo(() => {
    if (!currentUser) return undefined;
    
    // 優先使用 user_id 進行關聯
    const staff = staffList.find(staff => 
      staff.user_id === currentUser.id ||
      staff.email === currentUser.email || 
      staff.name === currentUser.name
    );
    
    if (staff) {
      console.log('👤 找到當前用戶員工資料:', {
        name: staff.name,
        role: staff.role,
        user_id: staff.user_id,
        currentUserId: currentUser.id
      });
    } else {
      console.log('⚠️ 未找到當前用戶員工資料:', {
        currentUserName: currentUser.name,
        currentUserId: currentUser.id,
        currentUserEmail: currentUser.email,
        availableStaff: staffList.map(s => ({ name: s.name, user_id: s.user_id, email: s.email }))
      });
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

  // 角色檢查（嚴格基於 currentUser.role）
  const isAdmin = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄特殊處理 - 使用正確的 Supabase Auth UID
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
      return true;
    }
    
    // 嚴格檢查 currentUser.role 是否為 admin
    const result = currentUser.role === 'admin';
    
    console.log('🔐 統一權限系統 - Admin 檢查:', {
      user: currentUser.name,
      role: currentUser.role,
      result
    });
    
    return result;
  }, [currentUser]);

  const isManager = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // 嚴格基於 currentUser.role 進行權限檢查
    const result = currentUser.role === 'manager' || isAdmin();
    
    console.log('🔐 統一權限系統 - Manager 檢查:', {
      user: currentUser.name,
      role: currentUser.role,
      result
    });
    
    return result;
  }, [currentUser, isAdmin]);

  const clearPermissionCache = useCallback(() => {
    permissionService.clearCache();
  }, [permissionService]);

  const clearCurrentUserCache = useCallback(() => {
    if (currentUser?.id) {
      permissionService.clearUserCache(currentUser.id);
    }
  }, [currentUser, permissionService]);

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

  useEffect(() => {
    const removeListener = permissionService.addPermissionUpdateListener(() => {
      console.log('🔔 權限更新，觸發重新檢查');
      clearPermissionCache();
      reloadBackendRoles();
    });

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
    rolesLoading
  };
};
