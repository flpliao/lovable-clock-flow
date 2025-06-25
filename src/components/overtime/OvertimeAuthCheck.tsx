
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useSessionManager } from '@/hooks/useSessionManager';

interface OvertimeAuthCheckProps {
  children: React.ReactNode;
}

const OvertimeAuthCheck: React.FC<OvertimeAuthCheckProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useUser();
  const { sessionStatus, ensureValidSession, requestReLogin } = useSessionManager();
  const [isValidating, setIsValidating] = useState(false);

  // 驗證完整的認證狀態
  const validateAuthState = async () => {
    setIsValidating(true);
    try {
      console.log('🔍 驗證完整認證狀態...');
      console.log('Context 狀態:', { hasUser: !!currentUser, isAuthenticated });
      console.log('Session 狀態:', sessionStatus);
      
      await ensureValidSession();
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      validateAuthState();
    }
  }, [isAuthenticated, currentUser]);

  // 載入中狀態
  if (sessionStatus.isChecking || isValidating) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-white mr-2" />
        <span className="text-white">檢查登入狀態...</span>
      </div>
    );
  }

  // 檢查認證狀態
  const contextAuthOk = isAuthenticated && currentUser;
  const sessionAuthOk = sessionStatus.isValid;
  const isFullyAuthenticated = contextAuthOk && sessionAuthOk;

  // 如果完全認證通過，顯示子組件
  if (isFullyAuthenticated) {
    return <>{children}</>;
  }

  // 顯示認證錯誤信息
  return (
    <div className="space-y-6">
      <Alert className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 shadow-xl">
        <AlertTriangle className="h-4 w-4 text-red-300" />
        <AlertDescription className="text-red-200">
          <div className="space-y-3">
            <div className="font-semibold text-lg">登入狀態異常</div>
            
            <div className="text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span>Context 認證狀態:</span>
                <span className={contextAuthOk ? 'text-green-300' : 'text-red-300'}>
                  {contextAuthOk ? '✅ 正常' : '❌ 異常'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Supabase Session:</span>
                <span className={sessionAuthOk ? 'text-green-300' : 'text-red-300'}>
                  {sessionAuthOk ? '✅ 有效' : '❌ 無效或已過期'}
                </span>
              </div>
              
              {currentUser && (
                <div className="pt-2 border-t border-red-300/30">
                  <div>用戶: {currentUser.name}</div>
                  <div>ID: {currentUser.id}</div>
                </div>
              )}
              
              {sessionStatus.error && (
                <div className="pt-2 border-t border-red-300/30 text-red-300">
                  <div className="font-medium">錯誤詳情:</div>
                  <div className="text-xs">{sessionStatus.error}</div>
                </div>
              )}
              
              {sessionStatus.lastChecked && (
                <div className="text-xs text-red-200">
                  最後檢查: {sessionStatus.lastChecked.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
      
      <div className="text-center space-y-4">
        <div className="flex gap-3 justify-center">
          <Button
            onClick={validateAuthState}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            disabled={isValidating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
            重新檢查狀態
          </Button>
          
          <Button
            onClick={requestReLogin}
            className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-blue-400/50"
          >
            <LogIn className="h-4 w-4 mr-2" />
            重新登入
          </Button>
        </div>
        
        <div className="text-white/80 text-sm max-w-md mx-auto">
          {!contextAuthOk && !sessionAuthOk 
            ? '請重新登入系統以繼續使用加班功能'
            : !sessionAuthOk 
            ? '登入狀態已過期，請重新登入'
            : '認證狀態異常，請重新檢查或登入'
          }
        </div>
      </div>
    </div>
  );
};

export default OvertimeAuthCheck;
