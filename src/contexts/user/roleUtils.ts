
import { User } from './types';
import { useMemo } from 'react';

export const createRoleChecker = (currentUser: User | null) => {
  // 使用 useMemo 穩定化函數，避免每次渲染都重新創建
  const isAdmin = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // 廖俊雄永遠是最高管理員 - 使用正確的 Supabase Auth UID
      const isLiaoJunxiong = (
        currentUser?.name === '廖俊雄' || 
        currentUser?.id === '0765138a-6f11-45f4-be07-dab965116a2d' || // 正確的 Supabase Auth UID
        currentUser?.email === 'flpliao@gmail.com' // 額外的 email 檢查
      );
      
      // 檢查 role 是否為 admin
      const isRoleAdmin = currentUser?.role === 'admin';
      
      console.log('🔐 管理員權限檢查 (修正後):', {
        userName: currentUser.name,
        userId: currentUser.id,
        email: currentUser?.email,
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
      
      // 廖俊雄可以管理所有用戶 - 使用正確的 Supabase Auth UID
      if (currentUser.name === '廖俊雄' || 
          currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d' ||
          currentUser?.email === 'flpliao@gmail.com') {
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
