
import { User } from './types';
import { permissionService } from '@/services/simplifiedPermissionService';

export const createSimplifiedPermissionChecker = (currentUser: User | null) => {
  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!currentUser) {
      console.log('🔐 用戶未登入，權限檢查失敗');
      return false;
    }
    
    try {
      const result = await permissionService.hasPermission(permission);
      
      console.log('🔐 UserContext 權限檢查 (RLS 兼容):', {
        user: currentUser.name,
        permission,
        result
      });
      
      return result;
    } catch (error) {
      console.error('❌ UserContext 權限檢查錯誤:', error);
      return false;
    }
  };

  return { hasPermission };
};
