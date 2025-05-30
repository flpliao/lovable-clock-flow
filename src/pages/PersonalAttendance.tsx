
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CheckInHistory from '@/components/CheckInHistory';
import AttendancePageHeader from '@/components/attendance/AttendancePageHeader';
import AttendanceCalendarView from '@/components/attendance/AttendanceCalendarView';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { CheckInRecord } from '@/types';

const PersonalAttendance = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('history');
  const [selectedDateRecords, setSelectedDateRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});
  const { checkInRecords, loadCheckInRecords, refreshData } = useSupabaseCheckIn();
  
  // 載入打卡記錄
  useEffect(() => {
    if (currentUser?.id) {
      console.log('PersonalAttendance - 載入打卡記錄，使用者ID:', currentUser.id);
      loadCheckInRecords();
    }
  }, [currentUser?.id, loadCheckInRecords]);
  
  // 根據選擇的日期過濾打卡記錄
  useEffect(() => {
    console.log('過濾打卡記錄 - 選擇日期:', date, '記錄數量:', checkInRecords.length);
    
    if (date && checkInRecords.length > 0) {
      const selectedDateStr = format(date, 'yyyy-MM-dd');
      console.log('選擇的日期字串:', selectedDateStr);
      
      const dayRecords = checkInRecords.filter(record => {
        const recordDate = format(new Date(record.timestamp), 'yyyy-MM-dd');
        const isMatch = recordDate === selectedDateStr && record.status === 'success';
        console.log(`記錄 ${record.id}: ${recordDate} === ${selectedDateStr} && ${record.status} === success = ${isMatch}`);
        return isMatch;
      });
      
      console.log('當日記錄:', dayRecords);
      
      const checkIn = dayRecords.find(record => record.action === 'check-in');
      const checkOut = dayRecords.find(record => record.action === 'check-out');
      
      console.log('找到的記錄:', { checkIn, checkOut });
      
      setSelectedDateRecords({ checkIn, checkOut });
    } else {
      console.log('沒有日期或記錄，清空選擇的記錄');
      setSelectedDateRecords({});
    }
  }, [date, checkInRecords]);

  // 當切換到月曆視圖時重新整理資料
  useEffect(() => {
    if (activeTab === 'calendar' && currentUser?.id) {
      console.log('切換到月曆視圖，重新整理資料');
      refreshData();
    }
  }, [activeTab, currentUser?.id, refreshData]);
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">請先登入</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <AttendancePageHeader />
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full sm:w-auto mb-6">
              <TabsTrigger value="history">打卡歷史</TabsTrigger>
              <TabsTrigger value="calendar">月曆視圖</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>打卡歷史</CardTitle>
                </CardHeader>
                <CardContent>
                  <CheckInHistory />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>月曆視圖</CardTitle>
                </CardHeader>
                <CardContent>
                  <AttendanceCalendarView
                    date={date}
                    setDate={setDate}
                    selectedDateRecords={selectedDateRecords}
                    checkInRecords={checkInRecords}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PersonalAttendance;
