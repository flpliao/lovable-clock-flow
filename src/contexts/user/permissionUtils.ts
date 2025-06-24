
import { User } from './types';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

export const createPermissionChecker = (currentUser: User | null, isAdmin: () => boolean) => {
  const permissionService = UnifiedPermissionService.getInstance();

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    
    // 使用統一權限服務進行檢查
    const context = {
      currentUser,
      staffData: undefined, // UserContext 中暫時不包含 staffData
      roles: [] // UserContext 中暫時不包含 roles
    };
    
    const unifiedResult = permissionService.hasPermission(permission, context);
    
    // 如果統一權限服務返回 true，直接返回
    if (unifiedResult) return true;
    
    // 保持原有的權限檢查邏輯作為後備（向後兼容）
    // 廖俊雄擁有所有權限
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 廖俊雄權限檢查:', permission, '✅ 允許');
      return true;
    }
    
    // 系統管理員擁有所有權限
    if (isAdmin()) {
      console.log('🔐 系統管理員權限檢查:', currentUser.name, permission, '✅ 允許');
      return true;
    }
    
    // 根據角色檢查特定權限
    switch (permission) {
      case 'view_staff':
      case 'manage_leave':
      case 'manage_departments':
      case 'create_department':
      case 'edit_department':
      case 'delete_department':
        return currentUser.role === 'manager';
      case 'create_announcement':
      case 'manage_announcements':
      case 'announcement:view':
      case 'announcement:create':
      case 'announcement:edit':
      case 'announcement:delete':
      case 'announcement:publish':
        return currentUser.department === 'HR';
      // 帳號管理權限檢查 - 系統管理員擁有所有權限
      case 'account:email:manage':
      case 'account:password:manage':
        return false; // 只有 admin 角色才有這些權限，上面已經處理
      // 排班管理權限檢查
      case 'schedule:view_all':
      case 'schedule:create':
      case 'schedule:edit':
      case 'schedule:delete':
      case 'schedule:manage':
        return isAdmin();
      case 'schedule:view_own':
        return true; // 所有登入用戶都能查看自己的排班
      default:
        return false;
    }
  };

  return { hasPermission };
};
