
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SessionStatus {
  isValid: boolean;
  isChecking: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useSessionManager = () => {
  const { currentUser, resetUserState } = useUser();
  const navigate = useNavigate();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isValid: false,
    isChecking: true,
    error: null,
    lastChecked: null
  });

  // 檢查 session 有效性
  const checkSession = async (): Promise<boolean> => {
    try {
      console.log('🔐 檢查 Session 狀態...');
      setSessionStatus(prev => ({ ...prev, isChecking: true, error: null }));

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session 檢查失敗:', error);
        setSessionStatus({
          isValid: false,
          isChecking: false,
          error: `Session 檢查失敗: ${error.message}`,
          lastChecked: new Date()
        });
        return false;
      }

      const isExpired = session?.expires_at ? (session.expires_at * 1000) < Date.now() : true;
      const isValid = !!session && !!session.user && !isExpired;

      console.log('📋 Session 檢查結果:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        isExpired,
        isValid,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'
      });

      setSessionStatus({
        isValid,
        isChecking: false,
        error: isValid ? null : '登入狀態已過期或無效',
        lastChecked: new Date()
      });

      return isValid;
    } catch (error: any) {
      console.error('❌ Session 檢查異常:', error);
      setSessionStatus({
        isValid: false,
        isChecking: false,
        error: `Session 檢查異常: ${error.message}`,
        lastChecked: new Date()
      });
      return false;
    }
  };

  // 處理 session 過期
  const handleSessionExpired = () => {
    console.log('⚠️ Session 已過期，清除用戶狀態');
    
    // 清除 Context 中的用戶狀態
    resetUserState();
    
    // 顯示提示訊息
    toast.error('登入狀態已過期，請重新登入', {
      duration: 5000,
    });
    
    // 導向登入頁
    navigate('/login', { 
      replace: true,
      state: { 
        from: window.location.pathname,
        message: '登入狀態已過期，請重新登入'
      }
    });
  };

  // 重新登入流程
  const requestReLogin = () => {
    console.log('🔄 請求重新登入');
    handleSessionExpired();
  };

  // 驗證並確保 session 有效（用於表單提交前）
  const ensureValidSession = async (): Promise<boolean> => {
    console.log('🔒 確保 Session 有效性...');
    
    const isValid = await checkSession();
    
    if (!isValid) {
      console.log('❌ Session 無效，處理過期狀況');
      handleSessionExpired();
      return false;
    }
    
    console.log('✅ Session 驗證通過');
    return true;
  };

  // 監聽 auth 狀態變化
  useEffect(() => {
    console.log('🎧 設置 Auth 狀態監聽器');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth 狀態變化:', event, session ? '有 session' : '無 session');
      
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // 重新檢查 session
        checkSession();
      }
    });

    // 初始檢查
    checkSession();

    return () => {
      console.log('🎧 移除 Auth 狀態監聽器');
      subscription.unsubscribe();
    };
  }, []);

  // 定期檢查 session（每 5 分鐘）
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser) {
        console.log('🕐 定期檢查 Session 狀態');
        checkSession();
      }
    }, 5 * 60 * 1000); // 5 分鐘

    return () => clearInterval(interval);
  }, [currentUser]);

  return {
    sessionStatus,
    checkSession,
    ensureValidSession,
    requestReLogin,
    handleSessionExpired
  };
};
