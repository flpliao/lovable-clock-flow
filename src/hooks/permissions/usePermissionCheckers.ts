
import { useCallback, useMemo } from 'react';
import { useUser } from '@/contexts/UserContext';
import { UnifiedPermissionService, UnifiedPermissionContext } from '@/services/unifiedPermissionService';
import { StaffRole } from '@/components/staff/types';
import { Staff } from '@/components/staff/types';

interface UsePermissionCheckersProps {
  backendRoles: StaffRole[];
  rolesLoading: boolean;
  currentStaffData?: Staff;
  permissionService: UnifiedPermissionService;
}

export const usePermissionCheckers = ({
  backendRoles,
  rolesLoading,
  currentStaffData,
  permissionService
}: UsePermissionCheckersProps) => {
  const { currentUser } = useUser();

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

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissionContext
  };
};
