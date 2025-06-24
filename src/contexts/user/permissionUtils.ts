
import { User } from './types';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

export const createPermissionChecker = (currentUser: User | null, isAdmin: () => boolean) => {
  const permissionService = UnifiedPermissionService.getInstance();

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // 使用統一權限服務進行檢查
    const context = {
      currentUser,
      staffData: undefined, // UserContext 中暫時不包含 staffData，將由統一權限服務處理
      roles: [] // 角色資料將由統一權限服務自動載入
    };
    
    const unifiedResult = permissionService.hasPermission(permission, context);
    
    console.log('🔐 UserContext 權限檢查:', {
      user: currentUser.name,
      permission,
      result: unifiedResult
    });
    
    return unifiedResult;
  };

  return { hasPermission };
};
