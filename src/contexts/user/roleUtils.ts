
import { User } from './types';

export const createRoleChecker = (currentUser: User | null) => {
  
  const isAdmin = (): boolean => {
    if (!currentUser) {
      console.log('🔐 用戶未登入，Admin 檢查失敗');
      return false;
    }

    // 特殊處理：flpliao@gmail.com 設為管理員
    if (currentUser.email === 'flpliao@gmail.com' || currentUser.name === 'flpliao@gmail.com') {
      console.log('🔐 特殊管理員檢查:', {
        email: currentUser.email,
        name: currentUser.name,
        result: true
      });
      return true;
    }

    // 廖俊雄特殊處理 - 更新為正確的 UUID
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
      console.log('🔐 超級管理員檢查通過:', currentUser.name);
      return true;
    }

    // 檢查角色
    const isRoleAdmin = currentUser.role === 'admin';
    
    console.log('🔐 Admin permission check:', {
      userName: currentUser.name,
      userId: currentUser.id,
      email: currentUser.email,
      role: currentUser.role,
      isRoleAdmin,
      result: isRoleAdmin
    });
    
    return isRoleAdmin;
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

    // 特殊處理：flpliao@gmail.com 設為主管
    if (currentUser.email === 'flpliao@gmail.com' || currentUser.name === 'flpliao@gmail.com') {
      return true;
    }

    // 檢查角色
    const isRoleManager = currentUser.role === 'manager';
    
    console.log('🔐 Manager permission check:', {
      userName: currentUser.name,
      role: currentUser.role,
      isRoleManager,
      result: isRoleManager
    });
    
    return isRoleManager;
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
