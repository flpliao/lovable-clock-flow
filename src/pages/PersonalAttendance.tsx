
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CheckInHistory from '@/components/CheckInHistory';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { CheckInRecord } from '@/types';
import { formatTime } from '@/utils/checkInUtils';

const PersonalAttendance = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('history'); // 預設為打卡歷史
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

  // 計算當日記錄數量
  const getDayRecordsCount = () => {
    if (!date) return 0;
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    return checkInRecords.filter(record => {
      const recordDate = format(new Date(record.timestamp), 'yyyy-MM-dd');
      return recordDate === selectedDateStr && record.status === 'success';
    }).length;
  };
  
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
      <Header />
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          {/* Header with back button */}
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">個人出勤</h1>
          </div>
          
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
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="mx-auto"
                        captionLayout="buttons"
                        formatters={{
                          formatCaption: (date, options) => {
                            return format(date, 'MMMM yyyy');
                          },
                        }}
                      />
                    </div>
                    
                    <div className="md:w-1/2">
                      {date && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium text-lg mb-4">
                            {format(date, 'yyyy年MM月dd日')} 出勤記錄
                          </h3>
                          
                          <div className="mb-2 text-sm text-gray-500">
                            打卡記錄總數: {getDayRecordsCount()}
                          </div>
                          
                          {selectedDateRecords.checkIn || selectedDateRecords.checkOut ? (
                            <div className="space-y-3">
                              {selectedDateRecords.checkIn && (
                                <div className="text-gray-700">
                                  <p className="flex justify-between">
                                    <span>上班時間:</span>
                                    <span className="font-medium text-green-600">
                                      {formatTime(selectedDateRecords.checkIn.timestamp)}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {selectedDateRecords.checkIn.type === 'location' 
                                      ? `位置打卡 - ${selectedDateRecords.checkIn.details.locationName}` 
                                      : `IP打卡 - ${selectedDateRecords.checkIn.details.ip}`
                                    }
                                  </p>
                                </div>
                              )}
                              
                              {selectedDateRecords.checkOut && (
                                <div className="text-gray-700">
                                  <p className="flex justify-between">
                                    <span>下班時間:</span>
                                    <span className="font-medium text-blue-600">
                                      {formatTime(selectedDateRecords.checkOut.timestamp)}
                                    </span>
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {selectedDateRecords.checkOut.type === 'location' 
                                      ? `位置打卡 - ${selectedDateRecords.checkOut.details.locationName}` 
                                      : `IP打卡 - ${selectedDateRecords.checkOut.details.ip}`
                                    }
                                  </p>
                                </div>
                              )}
                              
                              <div className="pt-2 border-t">
                                <p className="flex justify-between">
                                  <span>狀態:</span>
                                  <span className="font-medium text-green-600">
                                    {selectedDateRecords.checkIn && selectedDateRecords.checkOut 
                                      ? '正常' 
                                      : selectedDateRecords.checkIn 
                                        ? '未打下班卡' 
                                        : '僅下班打卡'
                                    }
                                  </span>
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-500 text-center py-8">
                              <p>此日期無打卡記錄</p>
                              <p className="text-sm mt-1">選擇的日期: {format(date, 'yyyy-MM-dd')}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
