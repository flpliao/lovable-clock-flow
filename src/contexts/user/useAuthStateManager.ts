
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { User } from './types';
import { createAuthHandlers } from './authHandlers';

export const useAuthStateManager = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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

  // 統一的重定向處理函數
  const handleRedirectAfterLogin = () => {
    if (window.location.pathname === '/login') {
      console.log('🔄 統一重定向處理：從登入頁面重定向到主頁');
      navigate('/', { replace: true });
    }
  };

  // 初始化認證狀態
  useEffect(() => {
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    console.log('👤 UserProvider: 初始化認證狀態管理');
    
    // 設置 Supabase Auth 监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth 状态变化:', event, '會話存在:', !!session);
      console.log('🔄 用戶信息:', session?.user?.email);
      console.log('🔄 當前路徑:', window.location.pathname);
      
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        console.log('✅ 用戶已登入 - 事件:', event);
        
        // 首先處理用戶登入
        await handleUserLogin(session);
        
        // 立即設定認證狀態
        setIsAuthenticated(true);
        console.log('🔐 設定認證狀態為 true');
        
        // 只在 SIGNED_IN 事件時重定向（即用戶剛剛登入）
        if (event === 'SIGNED_IN') {
          console.log('🔄 檢測到新登入，準備重定向');
          // 使用 requestAnimationFrame 確保狀態更新完成後再重定向
          requestAnimationFrame(() => {
            handleRedirectAfterLogin();
          });
        }
        
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
          setIsAuthenticated(true);
          
          // 如果在登入頁面且已有會話，重定向
          if (window.location.pathname === '/login') {
            console.log('🔄 在登入頁面發現現有會話，執行重定向');
            requestAnimationFrame(() => {
              handleRedirectAfterLogin();
            });
          }
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
  }, [handleUserLogin, handleUserLogout, navigate]);

  return {
    currentUser,
    setCurrentUser,
    isUserLoaded,
    userError,
    setUserError,
    isAuthenticated,
    setIsAuthenticated
  };
};
