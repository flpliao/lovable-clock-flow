import { ensureAuthInitialized, useAuthStore } from '@/stores/authStore';
import { usePermissionStore } from '@/stores/permissionStore';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { permissionService } from '@/services/simplifiedPermissionService';

/**
 * 便利的 hooks 來直接使用各個 stores
 * 提供更細粒度的狀態訂閱，避免不必要的重渲染
 */

// 自動初始化認證系統的 hook（無 Provider 模式）
export const useAutoInitAuth = () => {
  useEffect(() => {
    console.log('🚀 useAutoInitAuth: 自動初始化認證系統');
    ensureAuthInitialized();
  }, []);
};

// 用戶相關的 hooks
export const useCurrentUser = () => useUserStore(state => state.currentUser);
export const useUserLoaded = () => useUserStore(state => state.isUserLoaded);
export const useAnnualLeaveBalance = () => useUserStore(state => state.annualLeaveBalance);

// 認證相關的 hooks
export const useAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthError = () => useAuthStore(state => state.authError);
export const useAuthInitializing = () => useAuthStore(state => state.isInitializing);
export const useAuthInitialized = () => useAuthStore(state => state.isInitialized);

// 權限相關的 hooks
export const useIsAdmin = () => {
  const isAdmin = usePermissionStore(state => state.isAdmin);
  return isAdmin();
};

export const useIsManager = () => {
  const isManager = usePermissionStore(state => state.isManager);
  return isManager();
};

export const usePermissionChecker = () => {
  const hasPermission = usePermissionStore(state => state.hasPermission);
  const isLoadingPermission = usePermissionStore(state => state.isLoadingPermission);

  // 🆕 添加同步權限檢查方法
  const hasPermissionSync = (permission: string): boolean => {
    return permissionService.hasPermission(permission);
  };

  return {
    hasPermission,
    hasPermissionSync, // 🆕 同步權限檢查
    isLoadingPermission,
  };
};

export const useCanManageUser = () => {
  const canManageUser = usePermissionStore(state => state.canManageUser);
  return canManageUser;
};

// 組合 hooks - 常用的狀態組合
export const useUserAuth = () => {
  const currentUser = useCurrentUser();
  const isAuthenticated = useAuthenticated();
  const isUserLoaded = useUserLoaded();

  return {
    currentUser,
    isAuthenticated,
    isUserLoaded,
    isLoggedIn: isAuthenticated && !!currentUser,
  };
};

export const useUserPermissions = () => {
  const isAdmin = useIsAdmin();
  const isManager = useIsManager();
  const { hasPermission, isLoadingPermission } = usePermissionChecker();
  const canManageUser = useCanManageUser();

  return {
    isAdmin,
    isManager,
    hasPermission,
    isLoadingPermission,
    canManageUser,
  };
};

// 用戶操作 hooks
export const useUserActions = () => {
  const setCurrentUser = useUserStore(state => state.setCurrentUser);
  const setAnnualLeaveBalance = useUserStore(state => state.setAnnualLeaveBalance);
  const clearUserData = useUserStore(state => state.clearUserData);

  const forceLogout = useAuthStore(state => state.forceLogout);
  const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);

  const clearPermissionCache = usePermissionStore(state => state.clearPermissionCache);
  const refreshPermissions = usePermissionStore(state => state.refreshPermissions);

  return {
    // 用戶操作
    setCurrentUser,
    setAnnualLeaveBalance,
    clearUserData,

    // 認證操作
    forceLogout,
    setIsAuthenticated,

    // 權限操作
    clearPermissionCache,
    refreshPermissions,
  };
};

// 組合型完整用戶管理 hook（替代 UserProvider）
export const useCompleteUserManagement = () => {
  // 自動初始化認證
  useAutoInitAuth();

  // 獲取所有用戶相關狀態
  const userAuth = useUserAuth();
  const userPermissions = useUserPermissions();
  const userActions = useUserActions();
  const authError = useAuthError();

  return {
    // 狀態
    ...userAuth,
    ...userPermissions,
    authError,

    // 操作
    ...userActions,

    // 重置用戶狀態的便利方法
    resetUserState: async () => {
      console.log('🔄 重置用戶狀態');
      userActions.clearUserData();
      userActions.clearPermissionCache();
      await userActions.forceLogout();
    },
  };
};
