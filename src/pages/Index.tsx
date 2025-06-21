
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const {
    currentUser,
    annualLeaveBalance,
    userError,
    clearUserError,
    isUserLoaded,
    isAuthenticated
  } = useUser();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // 清理錯誤狀態
  useEffect(() => {
    if (userError) {
      console.log('Index page: clearing user error:', userError);
      const timeoutId = setTimeout(clearUserError, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [userError, clearUserError]);

  useEffect(() => {
    if (currentUser) {
      console.log('User state changed, clearing any existing errors');
      clearUserError();
    }
  }, [currentUser, clearUserError]);

  // 檢查登入狀態，若未登入則重定向到登入頁
  useEffect(() => {
    if (isUserLoaded && !isAuthenticated && !isRedirecting) {
      console.log('🚫 Index: 用戶未登入，重定向到登入頁面');
      setIsRedirecting(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    }
  }, [isUserLoaded, isAuthenticated, navigate, isRedirecting]);

  // 在載入用戶狀態期間顯示載入畫面
  if (!isUserLoaded) {
    console.log('🔄 Index: 正在載入用戶狀態...');
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>載入中...</p>
        </div>
      </div>
    );
  }

  // 重定向中狀態
  if (isRedirecting || !isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>跳轉中...</p>
        </div>
      </div>
    );
  }

  // 確保有用戶資料才渲染主頁面
  if (!currentUser) {
    console.log('⚠️ Index: 已驗證但無用戶資料');
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>載入用戶資料...</p>
        </div>
      </div>
    );
  }

  console.log('✅ Index: 用戶已登入，顯示主頁面:', currentUser.name);
  const leaveHours = annualLeaveBalance ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8 : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 背景層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      {/* 漂浮光點 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 w-full min-h-screen pb-safe pt-12 md:pt-20">
        {/* 歡迎區塊 */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <WelcomeSection userName={currentUser.name} />
        </div>

        {/* 打卡區塊（壓縮下邊距） */}
        <div className="w-full sm:px-6 lg:px-8 max-w-7xl mx-auto mb-[-4px] sm:mb-0 py-[20px] px-[15px]">
          <LocationCheckIn />
        </div>

        {/* 功能卡片（完全貼上打卡區） */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-0">
          <FeatureCards abnormalCount={0} annualLeaveBalance={leaveHours} />
        </div>
      </div>
    </div>
  );
};

export default Index;
