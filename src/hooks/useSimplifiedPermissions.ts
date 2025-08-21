
import { useFinalPermissions } from './useFinalPermissions';

/**
 * 簡化版權限 Hook - 重新導향到最終版本
 * 保持向後兼容性
 */
export const useSimplifiedPermissions = () => {
  const finalPermissions = useFinalPermissions();
  
  return {
    // 保持原有的 API
    hasPermission: finalPermissions.hasPermission,
    hasAnyPermission: finalPermissions.hasAnyPermission,
    hasAllPermissions: finalPermissions.hasAllPermissions,
    hasPermissionAsync: finalPermissions.hasPermissionAsync,
    
    // 角色檢查
    isAdmin: finalPermissions.isAdmin,
    isManager: finalPermissions.isManager,
    
    // 工具方法
    clearPermissionCache: finalPermissions.clearPermissionCache,
    
    // 用戶資訊
    currentUser: finalPermissions.currentUser
  };
};
