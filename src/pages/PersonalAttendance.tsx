
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/Header';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CheckInHistory from '@/components/CheckInHistory';
import LocationCheckIn from '@/components/LocationCheckIn';

const PersonalAttendance = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('today');
  
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
              <TabsTrigger value="today">今日打卡</TabsTrigger>
              <TabsTrigger value="history">打卡歷史</TabsTrigger>
              <TabsTrigger value="calendar">月曆視圖</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    今日打卡
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LocationCheckIn />
                </CardContent>
              </Card>
            </TabsContent>
            
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
                        // Customize caption to show only month and year
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
                          <h3 className="font-medium text-lg mb-4">{format(date, 'yyyy年MM月dd日')} 出勤記錄</h3>
                          
                          {/* This would show attendance data for the selected date */}
                          <div className="text-gray-700">
                            <p>上班時間: 9:00</p>
                            <p>下班時間: 18:00</p>
                            <p>狀態: 正常</p>
                          </div>
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
