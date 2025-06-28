
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { AnnualLeaveBalance } from '@/types';
import { User } from './types';
import { saveUserToStorage, clearUserStorage } from './userStorageUtils';
import { createAuthHandlers } from './authHandlers';

export const useUserState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initializationRef = useRef(false);
  const navigate = useNavigate();

  const { handleUserLogin, handleUserLogout } = createAuthHandlers(
    setCurrentUser,
    setIsAuthenticated,
    setUserError
  );

  // 初始化認證狀態
  useEffect(() => {
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    console.log('👤 UserProvider: 初始化認證狀態管理');
    
    // 設置 Supabase Auth 独立監聽器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth 独立監聽器:', event, '會話存在:', !!session);
      
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        console.log('✅ 用戶已登入 - 事件:', event);
        await handleUserLogin(session);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 用戶已登出');
        handleUserLogout();
      }
      
      // 標記用戶狀態已載入
      setIsUserLoaded(true);
    });

    // 立即檢查現有會話
    const initializeAuth = async () => {
      try {
        console.log('🔍 檢查現有會話...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ 獲取會話失敗:', error);
          setIsUserLoaded(true);
          return;
        }
        
        if (session) {
          console.log('📦 發現現有會話，載入用戶資料');
          await handleUserLogin(session);
        } else {
          console.log('❌ 未發現現有會話');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ 初始化認證狀態失敗:', error);
        setUserError('初始化認證失敗');
        setIsAuthenticated(false);
      } finally {
        setIsUserLoaded(true);
      }
    };

    // 立即檢查會話
    initializeAuth();

    // 清理函數
    return () => {
      subscription.unsubscribe();
    };
  }, [handleUserLogin, handleUserLogout]);

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
      
      // 確保認證狀態與用戶狀態同步
      if (!isAuthenticated) {
        console.log('⚠️ 用戶存在但認證狀態為 false，進行同步');
        setIsAuthenticated(true);
      }
    }
  }, [currentUser, isAuthenticated]);

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = async () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 登出');
    
    try {
      // 使用 Supabase Auth 登出
      await AuthService.signOut();
      
      // 立即重置本地狀態，不等待 onAuthStateChange
      console.log('🔄 立即重置本地狀態');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAnnualLeaveBalance(null);
      setUserError(null);
      clearUserStorage();
      
      // 清除權限快取
      const permissionService = UnifiedPermissionService.getInstance();
      permissionService.clearCache();
      
      // 導向登入頁面
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      // 即使登出失敗，也要清除本地狀態
      console.log('🔄 強制重置本地狀態');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAnnualLeaveBalance(null);
      setUserError(null);
      clearUserStorage();
      
      // 清除權限快取
      const permissionService = UnifiedPermissionService.getInstance();
      permissionService.clearCache();
      
      // 導向登入頁面
      navigate('/login', { replace: true });
    }
  };

  return {
    currentUser,
    setCurrentUser,
    annualLeaveBalance,
    setAnnualLeaveBalance,
    isUserLoaded,
    userError,
    clearUserError,
    resetUserState,
    isAuthenticated
  };
};
