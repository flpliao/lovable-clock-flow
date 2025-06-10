
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
    <div className="w-full min-h-screen pb-safe relative mobile-fullscreen">
      {/* 歡迎區塊 - 手機完全滿版 */}
      <div className="w-full px-1 sm:px-4 lg:px-8">
        <WelcomeSection userName={currentUser?.name || '訪客'} />
      </div>
      
      {/* 打卡區塊 - 手機完全滿版 */}
      <div className="w-full px-1 sm:px-4 lg:px-8 mb-2 sm:mb-6">
        <LocationCheckIn />
      </div>
      
      {/* 功能卡片 - 手機完全滿版 */}
      <div className="w-full px-1 sm:px-4 lg:px-8 pb-2 sm:pb-8">
        <FeatureCards 
          abnormalCount={0} 
          annualLeaveBalance={leaveHours} 
        />
      </div>
    </div>
  );
};

export default Index;
