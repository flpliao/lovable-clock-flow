import {
  useAuthenticated,
  useAuthInitialized,
  useAuthInitializing,
  useUserLoaded,
} from '@/hooks/useStores';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthenticated();
  const isInitializing = useAuthInitializing();
  const isInitialized = useAuthInitialized();
  const isUserLoaded = useUserLoaded();
  const location = useLocation();

  // 在認證系統初始化期間或用戶資料載入期間顯示載入畫面
  // 關鍵修復：確保認證系統完全初始化後才進行下一步判斷
  if (isInitializing || !isInitialized || !isUserLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">
            {isInitializing
              ? '初始化認證系統...'
              : !isInitialized
                ? '等待認證系統完成...'
                : '載入用戶資料...'}
          </p>
        </div>
      </div>
    );
  }

  // 只有在認證系統完全初始化且用戶資料載入完成後，才進行認證檢查
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
