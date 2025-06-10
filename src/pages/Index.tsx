
import React, { useEffect } from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import DashboardStats from '@/components/DashboardStats';
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
    <div className="min-h-screen pb-safe relative">
      {/* 歡迎區塊 */}
      <div className="px-4 sm:px-6 lg:px-8">
        <WelcomeSection userName={currentUser?.name || '訪客'} />
      </div>
      
      {/* Dashboard Stats - 新增儀表板統計卡片 */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <DashboardStats />
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
  );
};

export default Index;
