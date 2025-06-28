
import { User } from './types';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

export const createPermissionChecker = (currentUser: User | null, isAdmin: () => boolean) => {
  const permissionService = UnifiedPermissionService.getInstance();

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!currentUser) {
      console.log('🔐 權限檢查: 用戶未登入');
      return false;
    }
    
    try {
      // 廖俊雄擁有所有權限
      if (currentUser.name === '廖俊雄' && 
          currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
        console.log('🔐 廖俊雄權限檢查:', permission, '✅ 允許');
        return true;
      }
      
      // 管理員擁有所有權限
      if (currentUser.role === 'admin') {
        console.log('🔐 管理員權限檢查:', currentUser.name, permission, '✅ 允許');
        return true;
      }
      
      // 基本權限檢查
      const basicPermissions = [
        'overtime:view_own', 'overtime:create',
        'missed_checkin:view_own', 'missed_checkin:create',
        'leave:view_own', 'leave:create'
      ];
      
      if (basicPermissions.includes(permission)) {
        console.log('🔐 基本權限檢查:', currentUser.name, permission, '✅ 允許');
        return true;
      }
      
      // 管理者權限
      if (currentUser.role === 'manager') {
        const managerPermissions = [
          ...basicPermissions,
          'overtime:view_all', 'overtime:approve',
          'missed_checkin:view_all', 'missed_checkin:approve',
          'leave:view_all', 'leave:approve',
          'staff:view'
        ];
        
        const hasManagerPermission = managerPermissions.includes(permission);
        console.log('🔐 管理者權限檢查:', currentUser.name, permission, 
                   hasManagerPermission ? '✅ 允許' : '❌ 拒絕');
        return hasManagerPermission;
      }
      
      console.log('🔐 權限檢查失敗:', currentUser.name, permission, '❌ 拒絕');
      return false;
    } catch (error) {
      console.error('❌ UserContext 權限檢查錯誤:', error);
      return false;
    }
  };

  return { hasPermission };
};
