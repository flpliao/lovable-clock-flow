
import { useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';

export const useRoleCheckers = () => {
  const { currentUser } = useUser();

  // 角色檢查（嚴格基於 currentUser.role）
  const isAdmin = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // 廖俊雄特殊處理 - 使用正確的 Supabase Auth UID
    if (currentUser.name === '廖俊雄' && 
        currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
      return true;
    }
    
    // 嚴格檢查 currentUser.role 是否為 admin
    const result = currentUser.role === 'admin';
    
    console.log('🔐 統一權限系統 - Admin 檢查:', {
      user: currentUser.name,
      role: currentUser.role,
      result
    });
    
    return result;
  }, [currentUser]);

  const isManager = useCallback((): boolean => {
    if (!currentUser) return false;
    
    // 嚴格基於 currentUser.role 進行權限檢查
    const result = currentUser.role === 'manager' || isAdmin();
    
    console.log('🔐 統一權限系統 - Manager 檢查:', {
      user: currentUser.name,
      role: currentUser.role,
      result
    });
    
    return result;
  }, [currentUser, isAdmin]);

  return {
    isAdmin,
    isManager
  };
};
