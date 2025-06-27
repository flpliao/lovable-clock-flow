import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAttendanceRecords } from '@/hooks/useAttendanceRecords';
import AttendanceLoginPrompt from '@/components/attendance/AttendanceLoginPrompt';
import AttendanceTabsContainer from '@/components/attendance/AttendanceTabsContainer';

const PersonalAttendance = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState('history');
  const {
    date,
    setDate,
    selectedDateRecords,
    checkInRecords,
    refreshData
  } = useAttendanceRecords();
  
  const lastActiveTabRef = useRef(activeTab);

  // 當切換到月曆視圖時重新整理資料
  const handleCalendarTabRefresh = useCallback(async () => {
    if (activeTab === 'calendar' && currentUser?.id && lastActiveTabRef.current !== 'calendar') {
      console.log('切換到月曆視圖，重新整理資料');
      lastActiveTabRef.current = activeTab;
      await refreshData();
    }
  }, [activeTab, currentUser?.id, refreshData]);

  useEffect(() => {
    handleCalendarTabRefresh();
  }, [handleCalendarTabRefresh]);

  useEffect(() => {
    lastActiveTabRef.current = activeTab;
  }, [activeTab]);

  if (!currentUser) {
    return <AttendanceLoginPrompt />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent" />
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
      <div 
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" 
        style={{ animationDelay: '2s' }}
      />
      <div 
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" 
        style={{ animationDelay: '4s' }}
      />
      <div 
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" 
        style={{ animationDelay: '6s' }}
      />

      <div className="relative z-10 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-6 py-[50px]">
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
  );
};

export default PersonalAttendance;