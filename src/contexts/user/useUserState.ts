import { supabase } from '@/integrations/supabase/client';
import { AuthService } from '@/services/authService';
import { AnnualLeaveBalance } from '@/types';
import type { Session } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from './types';
import { getUserFromStorage } from './userStorageUtils';

export const useUserState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<AnnualLeaveBalance | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initializationRef = useRef(false);
  const navigate = useNavigate();

  // 簡化的登出功能
  const forceLogout = async () => {
    console.log('🔄 執行登出');
    try {
      // 清除 Supabase Auth 會話
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Supabase 登出失敗:', error);
      }
    } catch (error) {
      console.error('❌ 登出錯誤:', error);
    }
    
    // 清除本地狀態和 localStorage
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserError(null);
    localStorage.removeItem('currentUser');
    
    console.log('✅ 登出完成');
  };

  // 創建帶超時的 getSession 函數
  const getSessionWithTimeout = (timeout = 5000) => {
    return Promise.race([
      supabase.auth.getSession(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('getSession timeout')), timeout)
      )
    ]);
  };

  // 從 Supabase 會話恢復用戶狀態
  const restoreFromSupabaseSession = async () => {
    try {
      console.log('🔄 嘗試從 Supabase 會話恢復用戶狀態...');
      
      const result = await getSessionWithTimeout(5000);
      const { data: { session }, error } = result as { data: { session: Session | null }, error: Error | null };
      
      console.log('✅ getSession 完成', { 
        hasSession: !!session, 
        hasError: !!error,
        sessionUserId: session?.user?.id 
      });
      
      if (error) {
        console.error('❌ 獲取 Supabase 會話失敗:', error);
        return false;
      }
      
      if (session && session.user) {
        console.log('📦 發現 Supabase 會話，嘗試獲取用戶資料');
        
        // 使用 AuthService 獲取完整用戶資料
        const result = await AuthService.getUserFromSession(session.user.email || '');
        
        if (result.success && result.user) {
          // 將 AuthUser 轉換為 UserContext 所需的 User 類型
          const userForContext: User = {
            id: result.user.id,
            name: result.user.name || '未知用戶',
            position: result.user.position || '員工',
            department: result.user.department || '未分配',
            onboard_date: result.user.onboard_date || new Date().toISOString().split('T')[0],
            hire_date: result.user.hire_date,
            supervisor_id: result.user.supervisor_id,
            role: result.user.role || 'user',
            role_id: result.user.role_id || 'user',
            email: result.user.email
          };
          
          console.log('✅ 從 Supabase 會話恢復用戶成功:', userForContext.name);
          setCurrentUser(userForContext);
          setIsAuthenticated(true);
          setUserError(null);
          
          // 重新保存到 localStorage
          localStorage.setItem('currentUser', JSON.stringify(userForContext));
          
          return true;
        } else {
          console.error('❌ 從會話獲取用戶資料失敗:', result.error);
          return false;
        }
      } else {
        console.log('❌ 未發現有效的 Supabase 會話');
        return false;
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'getSession timeout') {
        console.error('⏰ Supabase getSession 調用超時');
      } else {
        console.error('❌ 從 Supabase 會話恢復失敗:', error);
      }
      return false;
    }
  };

  // 初始化 - 先檢查 localStorage，失敗則嘗試 Supabase
  useEffect(() => {
    if (initializationRef.current) {
      return;
    }
    initializationRef.current = true;

    const initializeUserState = async () => {
      console.log('👤 UserProvider: 初始化用戶狀態');
      
      try {
        // 第一步：嘗試從 localStorage 恢復用戶狀態
        console.log('🔍 步驟 1: 檢查本地存儲');
        const storedUser = getUserFromStorage();
        
        if (storedUser) {
          console.log('✅ 從本地存儲恢復用戶:', storedUser.name);
          setCurrentUser(storedUser);
          setIsAuthenticated(true);
          setUserError(null);
          return;
        }
        
        console.log('❌ 本地存儲中無用戶資料');
        
        // 第二步：嘗試從 Supabase 會話恢復
        console.log('🔍 步驟 2: 檢查 Supabase 會話');
        const sessionRestored = await restoreFromSupabaseSession();
        
        if (!sessionRestored) {
          console.log('❌ Supabase 會話恢復也失敗，設置為未認證狀態');
          setCurrentUser(null);
          setIsAuthenticated(false);
          setUserError(null);
        }
        
      } catch (error) {
        console.error('❌ 初始化用戶狀態失敗:', error);
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserError('初始化失敗');
      } finally {
        setIsUserLoaded(true);
        console.log('🏁 用戶狀態初始化完成');
      }
    };

    // 設置 Supabase Auth 監聽器（用於 magic link 等特殊認證流程）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth 狀態變化:', event, '會話存在:', !!session);
      
      // 只處理特定的認證事件，避免與手動登入衝突
      if (event === 'SIGNED_IN' && session) {
        // 檢查是否是外部認證流程（Magic Link、OAuth 等）
        const isFromAuthCallback = window.location.pathname === '/auth/callback';
        const hasUrlAuthParams = window.location.hash.includes('access_token') ||
                                 window.location.search.includes('code=') ||
                                 window.location.hash.includes('type=magiclink') ||
                                 window.location.hash.includes('type=recovery');
        
        // 檢查是否為非密碼登入（Magic Link、OAuth 等）
        const isExternalAuth = isFromAuthCallback || hasUrlAuthParams || 
                               !currentUser; // 如果當前沒有用戶但有會話，可能是外部認證
        
        if (isExternalAuth) {
          console.log('✅ 檢測到外部認證流程:', {
            email: session.user?.email,
            isFromCallback: isFromAuthCallback,
            hasUrlParams: hasUrlAuthParams,
            userExists: !!currentUser
          });
          
          try {
            // 使用 AuthService 獲取完整用戶資料
            const result = await AuthService.getUserFromSession(session.user?.email || '');
            
            if (result.success && result.user) {
              const userForContext: User = {
                id: result.user.id,
                name: result.user.name || '未知用戶',
                position: result.user.position || '員工',
                department: result.user.department || '未分配',
                onboard_date: result.user.onboard_date || new Date().toISOString().split('T')[0],
                hire_date: result.user.hire_date,
                supervisor_id: result.user.supervisor_id,
                role: result.user.role || 'user',
                role_id: result.user.role_id || 'user',
                email: result.user.email
              };
              
              console.log('✅ 外部認證登入成功:', userForContext.name);
              setCurrentUser(userForContext);
              setIsAuthenticated(true);
              setUserError(null);
              setIsUserLoaded(true);
              
              // 保存到 localStorage
              localStorage.setItem('currentUser', JSON.stringify(userForContext));
              
              // 清理 URL 中的認證參數（但不在 callback 頁面執行，讓 AuthCallback 處理）
              if (hasUrlAuthParams && !isFromAuthCallback) {
                window.history.replaceState({}, document.title, window.location.pathname);
              }
            } else {
              console.error('❌ 外部認證處理失敗:', result.error);
              setUserError('認證處理失敗');
            }
          } catch (error) {
            console.error('❌ 外部認證處理錯誤:', error);
            setUserError('認證處理失敗');
          }
        } else {
          console.log('ℹ️ 檢測到手動登入流程，跳過狀態監聽器處理');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 用戶已登出');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUserError(null);
        localStorage.removeItem('currentUser');
      } else if (event === 'TOKEN_REFRESHED' && session && !currentUser) {
        // 處理 token 刷新但沒有用戶資料的情況（可能是頁面重新載入後的狀態恢復）
        console.log('🔄 Token 已刷新，但無用戶資料，嘗試恢復');
        try {
          const result = await AuthService.getUserFromSession(session.user?.email || '');
          if (result.success && result.user) {
            const userForContext: User = {
              id: result.user.id,
              name: result.user.name || '未知用戶',
              position: result.user.position || '員工',
              department: result.user.department || '未分配',
              onboard_date: result.user.onboard_date || new Date().toISOString().split('T')[0],
              hire_date: result.user.hire_date,
              supervisor_id: result.user.supervisor_id,
              role: result.user.role || 'user',
              role_id: result.user.role_id || 'user',
              email: result.user.email
            };
            
            setCurrentUser(userForContext);
            setIsAuthenticated(true);
            localStorage.setItem('currentUser', JSON.stringify(userForContext));
          }
        } catch (error) {
          console.error('❌ Token 刷新後恢復用戶失敗:', error);
        }
      }
    });

    // 執行初始化
    initializeUserState();

    // 清理函數
    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    setIsUserLoaded,
    userError,
    clearUserError,
    resetUserState,
    isAuthenticated,
    setIsAuthenticated,
    setUserError,
    forceLogout
  };
};
