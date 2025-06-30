import { User } from './types';

export const createRoleChecker = (currentUser: User | null) => {
  
  const isAdmin = (): boolean => {
    if (!currentUser) {
      console.log('🔐 用戶未登入，Admin 檢查失敗');
      return false;
    }
    
    return currentUser.role_id === 'admin';
  };

  const isManager = (): boolean => {
    if (!currentUser) {
      console.log('🔐 用戶未登入，Manager 檢查失敗');
      return false;
    }

    // 管理員也是主管
    if (isAdmin()) {
      return true;
    }

    return currentUser.role_id === 'manager';
  };

  const canManageUser = (targetUserId: string): boolean => {
    if (!currentUser) return false;
    
    // 管理員可以管理所有用戶
    if (isAdmin()) return true;
    
    // 主管可以管理部分用戶（可以根據需要添加更多邏輯）
    if (isManager()) return true;
    
    // 用戶只能管理自己
    return currentUser.id === targetUserId;
  };

  return { isAdmin, isManager, canManageUser };
};
