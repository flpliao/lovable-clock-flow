
import { User } from './types';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

export const createPermissionChecker = (currentUser: User | null, isAdmin: () => boolean) => {
  const permissionService = UnifiedPermissionService.getInstance();

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // 載入最新的角色資料
      const roles = await permissionService.getCurrentRoles();
      
      // 使用統一權限服務進行檢查
      const context = {
        currentUser,
        staffData: undefined, // UserContext 中暫時不包含 staffData，將由統一權限服務處理
        roles
      };
      
      const unifiedResult = permissionService.hasPermission(permission, context);
      
      console.log('🔐 UserContext 權限檢查:', {
        user: currentUser.name,
        permission,
        result: unifiedResult
      });
      
      return unifiedResult;
    } catch (error) {
      console.error('❌ UserContext 權限檢查錯誤:', error);
      return false;
    }
  };

  return { hasPermission };
};
