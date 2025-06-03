
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pb-safe relative overflow-hidden">
      {/* Vision Pro 風格背景效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/15 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      
      <div className="relative z-10">
        {/* Vision Pro 風格的歡迎區塊 */}
        <div className="px-4 sm:px-6 lg:px-8">
          <WelcomeSection userName={currentUser?.name || '訪客'} />
        </div>
        
        {/* 打卡區塊 - Vision Pro 風格 */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-6">
            <LocationCheckIn />
          </div>
        </div>
        
        {/* 功能卡片 - Vision Pro 風格 */}
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
