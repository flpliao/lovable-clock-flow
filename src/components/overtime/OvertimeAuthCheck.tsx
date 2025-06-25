
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface OvertimeAuthCheckProps {
  children: React.ReactNode;
}

const OvertimeAuthCheck: React.FC<OvertimeAuthCheckProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useUser();
  const [supabaseAuthStatus, setSupabaseAuthStatus] = useState<{
    isAuthenticated: boolean;
    userId: string | null;
    isLoading: boolean;
    error: string | null;
  }>({
    isAuthenticated: false,
    userId: null,
    isLoading: true,
    error: null
  });

  const checkSupabaseAuth = async () => {
    try {
      console.log('🔐 檢查 Supabase 認證狀態...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Supabase 認證檢查失敗:', error);
        setSupabaseAuthStatus({
          isAuthenticated: false,
          userId: null,
          isLoading: false,
          error: `認證檢查失敗: ${error.message}`
        });
        return;
      }

      const userId = session?.user?.id || null;
      const isAuthenticated = !!session && !!userId;
      
      console.log('📋 Supabase 認證狀態:', {
        hasSession: !!session,
        userId,
        isAuthenticated,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'
      });

      setSupabaseAuthStatus({
        isAuthenticated,
        userId,
        isLoading: false,
        error: null
      });

    } catch (error: any) {
      console.error('❌ 認證狀態檢查異常:', error);
      setSupabaseAuthStatus({
        isAuthenticated: false,
        userId: null,
        isLoading: false,
        error: `認證檢查異常: ${error.message}`
      });
    }
  };

  useEffect(() => {
    checkSupabaseAuth();
  }, []);

  // 載入中狀態
  if (supabaseAuthStatus.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-white mr-2" />
        <span className="text-white">檢查登入狀態...</span>
      </div>
    );
  }

  // 檢查 Context 和 Supabase 認證狀態是否一致
  const contextAuthStatus = isAuthenticated && currentUser;
  const supabaseAuthOk = supabaseAuthStatus.isAuthenticated && supabaseAuthStatus.userId;
  
  // 如果兩者都正常，顯示子組件
  if (contextAuthStatus && supabaseAuthOk) {
    return <>{children}</>;
  }

  // 顯示認證錯誤信息
  return (
    <div className="space-y-6">
      <Alert className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 shadow-xl">
        <AlertTriangle className="h-4 w-4 text-red-300" />
        <AlertDescription className="text-red-200">
          <div className="space-y-2">
            <div className="font-semibold">登入狀態已過期，請重新登入</div>
            <div className="text-sm space-y-1">
              <div>Context 認證狀態: {contextAuthStatus ? '✅ 正常' : '❌ 異常'}</div>
              <div>Supabase 認證狀態: {supabaseAuthOk ? '✅ 正常' : '❌ 異常'}</div>
              {currentUser && (
                <div>當前用戶: {currentUser.name} (ID: {currentUser.id})</div>
              )}
              {supabaseAuthStatus.userId && (
                <div>Supabase 用戶ID: {supabaseAuthStatus.userId}</div>
              )}
              {supabaseAuthStatus.error && (
                <div className="text-red-300">錯誤: {supabaseAuthStatus.error}</div>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="text-center space-y-4">
        <Button
          onClick={checkSupabaseAuth}
          variant="outline"
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          重新檢查登入狀態
        </Button>
        
        <div className="text-white/80 text-sm">
          如果問題持續存在，請嘗試重新登入系統
        </div>
      </div>
    </div>
  );
};

export default OvertimeAuthCheck;
