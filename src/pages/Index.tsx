
import React, { useEffect } from 'react';
import WelcomeSection from '@/components/WelcomeSection';
import FeatureCards from '@/components/FeatureCards';
import LocationCheckIn from '@/components/LocationCheckIn';
import { useUser } from '@/contexts/UserContext';
import { visionProStyles, createVisionProBackground } from '@/utils/visionProStyles';

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
    <div className={`min-h-screen ${createVisionProBackground()} pb-safe`}>
      {/* Vision Pro 風格背景效果 - 增強淡藍色效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/25 via-blue-400/15 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-600/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>
      
      {/* 增加更多淡藍色光暈效果 */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400/5 via-transparent to-blue-600/5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-blue-800/10"></div>
      
      {/* 浮動光點效果 - 增加藍色調 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300/50 rounded-full animate-float shadow-lg shadow-blue-300/30"></div>
      <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-blue-400/40 rounded-full animate-float shadow-lg shadow-blue-400/30" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-200/40 rounded-full animate-float shadow-lg shadow-blue-200/20" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/6 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-float shadow-lg shadow-white/20" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-500/30 rounded-full animate-float shadow-lg shadow-blue-500/20" style={{ animationDelay: '3s' }}></div>
      
      <div className="relative z-10">
        {/* Vision Pro 風格的歡迎區塊 */}
        <div className="px-4 sm:px-6 lg:px-8">
          <WelcomeSection userName={currentUser?.name || '訪客'} />
        </div>
        
        {/* 打卡區塊 - 使用新的 Liquid Glass 風格 */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <div className={`${visionProStyles.liquidGlassCardWithGlow} p-6 relative`}>
            <LocationCheckIn />
          </div>
        </div>
        
        {/* 功能卡片 - 使用新的 Liquid Glass 風格 */}
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
