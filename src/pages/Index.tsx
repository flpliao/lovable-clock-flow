
import React, { useEffect } from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { currentUser, annualLeaveBalance, userError, clearUserError } = useUser();
  
  // 更積極地清除錯誤狀態
  useEffect(() => {
    // 頁面載入時立即清除錯誤
    if (userError) {
      console.log('Index page: clearing user error immediately:', userError);
      clearUserError();
    }
    
    // 也在組件掛載時清除錯誤
    const timeoutId = setTimeout(() => {
      clearUserError();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [userError, clearUserError]);
  
  // 當用戶狀態改變時也清除錯誤
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
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* 手機友善的間距調整 */}
      <div className="px-3 sm:px-4">
        <WelcomeSection userName={currentUser?.name || '訪客'} />
      </div>
      
      {/* 打卡區塊 - 手機優化 */}
      <div className="px-3 sm:px-4 mb-4">
        <LocationCheckIn />
      </div>
      
      {/* 功能卡片 - 手機優化 */}
      <div className="px-3 sm:px-4 pb-6">
        <FeatureCards 
          abnormalCount={0} 
          annualLeaveBalance={leaveHours} 
        />
      </div>
    </div>
  );
};

export default Index;
