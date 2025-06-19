import React, { useEffect } from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { currentUser, annualLeaveBalance, userError, clearUserError } = useUser();

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

  const leaveHours = annualLeaveBalance
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8
    : 0;

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

      <div className="relative z-10 w-full min-h-screen pb-safe pt-4 md:pt-12">
        {/* 歡迎區塊 */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <WelcomeSection userName={currentUser?.name || '訪客'} />
        </div>

        {/* 打卡區塊：取消底部圓角 */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-[-12px] sm:mb-[-6px]">
          <div className="rounded-b-none">
            <LocationCheckIn />
          </div>
        </div>

        {/* 功能卡片 */}
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-0">
          <FeatureCards 
            abnormalCount={0} 
            annualLeaveBalance={leaveHours} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;