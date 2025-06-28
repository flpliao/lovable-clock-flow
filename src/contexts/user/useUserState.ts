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

  // 程式更新檢測和自動登出
  useEffect(() => {
    let viteUpdateDetected = false;

    // 檢測 Vite 熱更新
    if (import.meta.hot) {
      const handleViteUpdate = () => {
        if (!viteUpdateDetected) {
          viteUpdateDetected = true;
          console.log('🔄 檢測到程式更新，執行自動登出');
          
          // 執行登出
          AuthService.signOut().then(() => {
            // 清除用戶狀態
            handleUserLogout();
            // 重定向到登入頁面
            navigate('/login', { replace: true });
          });
        }
      };

      // 監聽 Vite 更新事件
      import.meta.hot.on('vite:beforeUpdate', handleViteUpdate);
      
      // 清理函數
      return () => {
        if (import.meta.hot) {
          import.meta.hot.off('vite:beforeUpdate', handleViteUpdate);
        }
      };
    }

    // 備用方案：監聽頁面刷新事件
    const handleBeforeUnload = () => {
      // 標記為刷新，而非程式更新
      sessionStorage.setItem('page_refreshed', 'true');
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 檢查是否為頁面刷新後的重新載入
        const wasRefreshed = sessionStorage.getItem('page_refreshed');
        if (wasRefreshed) {
          sessionStorage.removeItem('page_refreshed');
          console.log('🔄 檢測到頁面刷新，執行自動登出');
          
          // 執行登出
          AuthService.signOut().then(() => {
            handleUserLogout();
            navigate('/login', { replace: true });
          });
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, handleUserLogout]);

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
      
      // 導向登入頁面
      navigate('/login', { replace: true });
      
    } catch (error) {
      console.error('❌ 登出失敗:', error);
      // 即使登出失敗，也要導向登入頁面
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
    isAuthenticated,
    setIsAuthenticated,
    setUserError
  };
};
