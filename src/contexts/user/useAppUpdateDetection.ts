
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/authService';

export const useAppUpdateDetection = (handleUserLogout: () => void) => {
  const navigate = useNavigate();

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
};
