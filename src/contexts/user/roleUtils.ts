
import { User } from './types';
import { useMemo } from 'react';

export const createRoleChecker = (currentUser: User | null) => {
  // 使用 useMemo 穩定化函數，避免每次渲染都重新創建
  const isAdmin = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // 廖俊雄永遠是最高管理員 - 使用 email 和實際 ID 檢查
      const isLiaoJunxiong = (
        currentUser?.name === '廖俊雄' || 
        currentUser?.id === 'ae688814-f6ef-460a-b4b1-f3a2c378c044' ||
        currentUser?.id === '0765138a-6f11-45f4-be07-dab965116a2d' // auth.users 中的 ID
      );
      
      // 檢查 role 是否為 admin
      const isRoleAdmin = currentUser?.role === 'admin';
      
      console.log('🔐 管理員權限檢查 (使用實際ID):', {
        userName: currentUser.name,
        userId: currentUser.id,
        role: currentUser.role,
        isLiaoJunxiong,
        isRoleAdmin,
        finalResult: isLiaoJunxiong || isRoleAdmin
      });
      
      return isLiaoJunxiong || isRoleAdmin;
    };
  }, [currentUser]);

  const isManager = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // 基於 role 進行權限檢查
      const result = currentUser.role === 'manager' || isAdmin();
      
      console.log('🔐 管理者權限檢查:', {
        userName: currentUser.name,
        role: currentUser.role,
        result
      });
      
      return result;
    };
  }, [currentUser, isAdmin]);

  const canManageUser = useMemo(() => {
    return (userId: string): boolean => {
      if (!currentUser) return false;
      
      // 廖俊雄可以管理所有用戶 - 使用實際 ID
      if (currentUser.name === '廖俊雄' || 
          currentUser.id === 'ae688814-f6ef-460a-b4b1-f3a2c378c044' ||
          currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
        console.log('🔐 廖俊雄最高管理員: 可管理所有用戶');
        return true;
      }
      
      // 系統管理員可以管理所有用戶
      if (isAdmin()) {
        console.log('🔐 系統管理員: 可管理所有用戶', currentUser.name);
        return true;
      }
      
      // 管理員或用戶管理自己
      const result = currentUser.role === 'manager' || currentUser.id === userId;
      
      console.log('🔐 用戶管理權限檢查:', {
        userName: currentUser.name,
        role: currentUser.role,
        targetUserId: userId,
        result
      });
      
      return result;
    };
  }, [currentUser, isAdmin]);

  return { isAdmin, isManager, canManageUser };
};
