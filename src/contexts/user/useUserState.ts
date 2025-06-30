
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { AnnualLeaveBalance } from '@/types';
import { User } from './types';
import { saveUserToStorage, clearUserStorage } from './userStorageUtils';
import { createAuthHandlers } from './authHandlers';
import type { Session } from '@supabase/supabase-js';

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

  // 強制登出功能
  const forceLogout = async () => {
    console.log('🔄 執行強制登出');
    await handleUserLogout();
  };

  // 初始化認證狀態
  useEffect(() => {
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    console.log('👤 UserProvider: 初始化認證狀態管理');
    
    // 清除可能的舊狀態
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserError(null);
    
    // 設置 Supabase Auth 監聽器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth 狀態變化:', event, '會話存在:', !!session);
      
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        console.log('✅ 用戶已登入 - 事件:', event);
        await handleUserLogin(session as Session);
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 用戶已登出');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserError(null);
        clearUserStorage();
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
          await handleUserLogin(session as Session);
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

  const clearUserError = () => {
    setUserError(null);
  };

  const resetUserState = async () => {
    console.log('🔄 UserProvider: 重置用戶狀態 - 強制登出');
    await forceLogout();
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
    setUserError,
    forceLogout
  };
};
