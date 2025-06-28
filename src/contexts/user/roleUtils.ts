
import { User } from './types';
import { useMemo } from 'react';

export const createRoleChecker = (currentUser: User | null) => {
  // 使用 useMemo 穩定化函數，避免每次渲染都重新創建
  const isAdmin = useMemo((): (() => boolean) => {
    return () => {
      if (!currentUser) return false;
      
      // 廖俊雄永遠是最高管理員
      const isLiaoJunxiong = currentUser?.name === '廖俊雄' && 
                            currentUser?.id === '550e8400-e29b-41d4-a716-446655440001';
      
      // 檢查 endless640c@gmail.com 是否為管理員 - 擴大檢查條件
      const isEndlessAdmin = currentUser?.name === 'endless640c' || 
                             currentUser?.id === 'ddd209be-0408-4fcc-80c9-d33e9c1042ca' ||
                             (currentUser?.name && currentUser.name.includes('endless640c'));
      
      // 檢查 role 是否為 admin
      const isRoleAdmin = currentUser?.role === 'admin';
      
      console.log('🔐 管理員權限檢查 (擴大版):', {
        userName: currentUser.name,
        userId: currentUser.id,
        role: currentUser.role,
        isLiaoJunxiong,
        isEndlessAdmin,
        isRoleAdmin,
        finalResult: isLiaoJunxiong || isEndlessAdmin || isRoleAdmin
      });
      
      // 特別處理：如果是 endless640c 相關用戶，強制返回 true
      if (isEndlessAdmin) {
        console.log('🔐 endless640c 用戶強制設為管理員');
        return true;
      }
      
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
      
      // 廖俊雄可以管理所有用戶
      if (currentUser.name === '廖俊雄' && 
          currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
        console.log('🔐 廖俊雄最高管理員: 可管理所有用戶');
        return true;
      }
      
      // endless640c 也可以管理所有用戶 - 擴大檢查
      if (currentUser.name === 'endless640c' || 
          currentUser.id === 'ddd209be-0408-4fcc-80c9-d33e9c1042ca' ||
          (currentUser.name && currentUser.name.includes('endless640c'))) {
        console.log('🔐 endless640c 管理員: 可管理所有用戶');
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
