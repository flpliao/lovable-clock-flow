
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <AttendanceWelcomeHeader />
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
  );
};

export default PersonalAttendance;
