import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import WelcomeSection from '@/components/WelcomeSection';
import {
  useAnnualLeaveBalance,
  useAuthenticated,
  useCurrentUser,
  useUserLoaded,
} from '@/hooks/useStores';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  // 認證系統已在 App.tsx 中初始化，此處不需要重複初始化

  // 使用新的 Zustand hooks - 精確訂閱
  const currentUser = useCurrentUser();
  const isAuthenticated = useAuthenticated();
  const isUserLoaded = useUserLoaded();
  const annualLeaveBalance = useAnnualLeaveBalance();

  const navigate = useNavigate();

  // 檢查登入狀態，若未登入則重定向到登入頁
  useEffect(() => {
    // 只有當用戶狀態載入完成後才進行檢查
    if (!isUserLoaded) {
      return;
    }

    console.log('🔍 Index: 檢查認證狀態', {
      isUserLoaded,
      isAuthenticated,
      hasCurrentUser: !!currentUser,
    });

    // 如果確實未登入，立即重定向
    if (!isAuthenticated || !currentUser) {
      console.log('🚫 Index: 用戶未登入，立即重定向到登入頁面');
      navigate('/login', { replace: true });
      return;
    }

    console.log('✅ Index: 用戶已登入，顯示主頁面');
  }, [isUserLoaded, isAuthenticated, currentUser, navigate]);

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

  // 如果未登入，顯示跳轉畫面（很快就會重定向）
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p>跳轉中...</p>
        </div>
      </div>
    );
  }

  console.log('✅ Index: 用戶已登入，顯示主頁面:', currentUser.name);

  const leaveHours = annualLeaveBalance
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8
    : 0;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen flex justify-center ">
      {/* 背景層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      {/* 漂浮光點 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
        style={{
          animationDelay: '2s',
        }}
      ></div>
      <div
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse"
        style={{
          animationDelay: '4s',
        }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse"
        style={{
          animationDelay: '6s',
        }}
      ></div>

      <div className="relative z-10 w-full min-h-screen pb-safe md:pt-12 py-0">
        {/* 歡迎區塊 */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <WelcomeSection userName={currentUser.name} />
        </div>

        {/* 打卡區塊（壓縮下邊距） */}
        <div className="w-full sm:px-6 lg:px-8 max-w-7xl mx-auto mb-[-8px] sm:mb-0 py-[10px] px-[15px]">
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
