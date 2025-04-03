
import React from 'react';
import Header from '@/components/Header';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import ShiftReminder from '@/components/ShiftReminder';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { currentUser, annualLeaveBalance } = useUser();
  
  // Calculate leave balance in hours (1 day = 8 hours)
  const leaveHours = annualLeaveBalance 
    ? (annualLeaveBalance.total_days - annualLeaveBalance.used_days) * 8 
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1 flex flex-col">
        <WelcomeSection userName={currentUser?.name || '訪客'} />
        
        {/* Add shift reminder */}
        {currentUser && <ShiftReminder />}
        
        <FeatureCards 
          abnormalCount={0} 
          annualLeaveBalance={leaveHours} 
        />
        
        <LocationCheckIn />
      </main>
    </div>
  );
};

export default Index;
