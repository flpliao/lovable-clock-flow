
import { useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useBackendRoles } from './permissions/useBackendRoles';
import { useCurrentStaffData } from './permissions/useCurrentStaffData';
import { usePermissionCheckers } from './permissions/usePermissionCheckers';
import { useRoleCheckers } from './permissions/useRoleCheckers';
import { usePermissionEventListeners } from './permissions/usePermissionEventListeners';

export const useUnifiedPermissions = () => {
  const { currentUser } = useUser();
  const { backendRoles, rolesLoading, reloadBackendRoles, permissionService } = useBackendRoles();
  const currentStaffData = useCurrentStaffData();
  
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    permissionContext
  } = usePermissionCheckers({
    backendRoles,
    rolesLoading,
    currentStaffData,
    permissionService
  });

  const { isAdmin, isManager } = useRoleCheckers();

  const clearPermissionCache = useCallback(() => {
    permissionService.clearCache();
  }, [permissionService]);

  const clearCurrentUserCache = useCallback(() => {
    if (currentUser?.id) {
      permissionService.clearUserCache(currentUser.id);
    }
  }, [currentUser, permissionService]);

  usePermissionEventListeners({
    permissionService,
    clearPermissionCache,
    reloadBackendRoles
  });

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
