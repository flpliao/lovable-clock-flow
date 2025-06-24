
import { User } from './types';

export const createRoleChecker = (currentUser: User | null) => {
  const isAdmin = (): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄永遠是最高管理員
    const isLiaoJunxiong = currentUser?.name === '廖俊雄' && 
                          currentUser?.id === '550e8400-e29b-41d4-a716-446655440001';
    
    // 檢查角色是否為 admin（基於 role_id 動態設定）
    const isRoleAdmin = currentUser?.role === 'admin';
    
    console.log('🔐 管理員權限檢查:', {
      userName: currentUser.name,
      userId: currentUser.id,
      role: currentUser.role,
      isLiaoJunxiong,
      isRoleAdmin,
      finalResult: isLiaoJunxiong || isRoleAdmin
    });
    
    return isLiaoJunxiong || isRoleAdmin;
  };

  const isManager = (): boolean => {
    if (!currentUser) return false;
    
    // 基於 role_id 動態設定的權限檢查
    const result = currentUser.role === 'manager' || isAdmin();
    
    console.log('🔐 管理者權限檢查:', {
      userName: currentUser.name,
      role: currentUser.role,
      result
    });
    
    return result;
  };

  const canManageUser = (userId: string): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄可以管理所有用戶
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 廖俊雄最高管理員: 可管理所有用戶');
      return true;
    }
    
    // 系統管理員可以管理所有用戶（基於 role_id 動態設定）
    if (isAdmin()) {
      console.log('🔐 系統管理員: 可管理所有用戶', currentUser.name);
      return true;
    }
    
    // 管理員或用戶管理自己（基於 role_id 動態設定）
    const result = currentUser.role === 'manager' || currentUser.id === userId;
    
    console.log('🔐 用戶管理權限檢查:', {
      userName: currentUser.name,
      role: currentUser.role,
      targetUserId: userId,
      result
    });
    
    return result;
  };

  return { isAdmin, isManager, canManageUser };
};
