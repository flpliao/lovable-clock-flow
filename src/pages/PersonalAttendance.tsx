
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
import { Calendar, Clock, User, History } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-medium text-white drop-shadow-lg mb-4">請先登入</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-white/30 backdrop-blur-xl text-white rounded-2xl border border-white/40 hover:bg-white/40 transition-all duration-300 shadow-lg font-medium"
          >
            前往登入
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
              個人考勤管理
            </h1>
            <p className="text-white/80 text-lg font-medium drop-shadow-md">
              查看您的打卡記錄和考勤統計
            </p>
          </div>
          
          {/* Time and Date Cards */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-4 flex items-center gap-3 shadow-lg">
              <div className="p-3 bg-blue-500/80 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white drop-shadow-md">15:01</div>
                <div className="text-white/70 text-sm">當前時間</div>
              </div>
            </div>
            
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-4 flex items-center gap-3 shadow-lg">
              <div className="p-3 bg-green-500/80 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white drop-shadow-md">2025年6月10日 星期二</div>
                <div className="text-white/70 text-sm">今天日期</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl">
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/80 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white drop-shadow-md">考勤記錄</h2>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="p-6 pb-0">
              <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                <TabsTrigger 
                  value="history" 
                  className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  打卡歷史
                </TabsTrigger>
                <TabsTrigger 
                  value="calendar" 
                  className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  月曆視圖
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="history" className="mt-0">
                <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-500/80 rounded-lg flex items-center justify-center">
                      <History className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white drop-shadow-md">打卡歷史記錄</h3>
                  </div>
                  <CheckInHistory />
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0">
                <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-500/80 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white drop-shadow-md">月曆視圖</h3>
                  </div>
                  <AttendanceCalendarView
                    date={date}
                    setDate={setDate}
                    selectedDateRecords={selectedDateRecords}
                    checkInRecords={checkInRecords}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PersonalAttendance;
