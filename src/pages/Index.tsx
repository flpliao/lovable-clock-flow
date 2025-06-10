
import React, { useEffect } from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { currentUser, annualLeaveBalance, userError, clearUserError } = useUser();
  
  // 統一的錯誤清除邏輯
  useEffect(() => {
    if (userError) {
      console.log('Index page: clearing user error:', userError);
      const timeoutId = setTimeout(clearUserError, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [userError, clearUserError]);
  
  // 當用戶狀態改變時清除錯誤
  useEffect(() => {
    if (currentUser) {
      console.log('User state changed, clearing any existing errors');
      clearUserError();
    }
  }, [currentUser, clearUserError]);
  
  // Calculate leave balance in hours (1 day = 8 hours)
  const leaveHours = annualLeaveBalance 
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8 
    : 0;

  return (
    <div className="min-h-screen pb-safe relative overflow-hidden">
      {/* 藍色漸變背景 - 類似圖片 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"></div>
      
      {/* 柔和的光暈效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-300/30 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10">
        {/* 歡迎區塊 */}
        <div className="px-4 sm:px-6 lg:px-8">
          <WelcomeSection userName={currentUser?.name || '訪客'} />
        </div>
        
        {/* 打卡區塊 */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <LocationCheckIn />
        </div>
        
        {/* 功能卡片 */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
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
