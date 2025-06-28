
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { AuthService } from '@/services/authService';
import { User } from './types';
import { AnnualLeaveBalance } from '@/types';
import { saveUserToStorage } from './userStorageUtils';

interface UseUserEffectsProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  setAnnualLeaveBalance: (balance: AnnualLeaveBalance | null) => void;
  setUserError: (error: string | null) => void;
}

export const useUserEffects = ({
  currentUser,
  isAuthenticated,
  setAnnualLeaveBalance,
  setUserError
}: UseUserEffectsProps) => {
  const navigate = useNavigate();

  // 當用戶改變時的處理
  useEffect(() => {
    if (!currentUser) {
      setAnnualLeaveBalance(null);
      setUserError(null);
      console.log('👤 UserProvider: 用戶登出，清除所有狀態');
    } else {
      console.log('👤 UserProvider: 用戶登入:', currentUser.name, '權限等級:', currentUser.role);
      console.log('🔐 當前認證狀態:', isAuthenticated);
      
      // 將用戶資料存儲到本地存儲
      saveUserToStorage(currentUser);
      setUserError(null);
      
      // 清除權限快取，確保使用最新權限
      const permissionService = UnifiedPermissionService.getInstance();
      permissionService.clearCache();
    }
  }, [currentUser, isAuthenticated, setAnnualLeaveBalance, setUserError]);

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = async () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 登出');
    
    try {
      // 使用 Supabase Auth 登出
      await AuthService.signOut();
      
      // 導向登入頁面
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      // 即使登出失敗，也要導向登入頁面
      navigate('/login', { replace: true });
    }
  };

  return {
    clearUserError,
    resetUserState
  };
};
