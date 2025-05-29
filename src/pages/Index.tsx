
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { currentUser, annualLeaveBalance, userError, clearUserError } = useUser();
  
  // 清除可能的錯誤狀態當頁面載入時
  useEffect(() => {
    if (userError) {
      console.log('Clearing user error on Index page load:', userError);
      clearUserError();
    }
  }, [userError, clearUserError]);
  
  // Calculate leave balance in hours (1 day = 8 hours)
  const leaveHours = annualLeaveBalance 
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8 
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <WelcomeSection userName={currentUser?.name || '訪客'} />
        
        <LocationCheckIn />
        
        <FeatureCards 
          abnormalCount={0} 
          annualLeaveBalance={leaveHours} 
        />
      </main>
    </div>
  );
};

export default Index;
