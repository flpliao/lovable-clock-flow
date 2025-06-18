
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAttendanceRecords } from '@/hooks/useAttendanceRecords';
import AttendanceLoginPrompt from '@/components/attendance/AttendanceLoginPrompt';
import AttendanceWelcomeHeader from '@/components/attendance/AttendanceWelcomeHeader';
import AttendanceTabsContainer from '@/components/attendance/AttendanceTabsContainer';

const PersonalAttendance = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('history');
  const { date, setDate, selectedDateRecords, checkInRecords, refreshData } = useAttendanceRecords();

  // 當切換到月曆視圖時重新整理資料
  useEffect(() => {
    if (activeTab === 'calendar' && currentUser?.id) {
      console.log('切換到月曆視圖，重新整理資料');
      refreshData();
    }
  }, [activeTab, currentUser?.id, refreshData]);
  
  if (!currentUser) {
    return <AttendanceLoginPrompt />;
  }
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 w-full">
        <div className="w-full px-0 sm:px-4 lg:px-8 pt-32 md:pt-36 pb-6">
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl mx-4 shadow-xl">
            <div className="p-6">
              <AttendanceWelcomeHeader />
            </div>
          </div>
        </div>

        <div className="w-full px-0 sm:px-4 lg:px-8 pb-6">
          <div className="mx-4">
            <AttendanceTabsContainer
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              date={date}
              setDate={setDate}
              selectedDateRecords={selectedDateRecords}
              checkInRecords={checkInRecords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAttendance;
