
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, UserPlus, Clock, Users, BarChart3, Settings, Sparkles } from 'lucide-react';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import ScheduleForm from '@/components/ScheduleForm';
import TimeSlotManagement from '@/components/TimeSlotManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { SchedulingProvider } from '@/contexts/SchedulingContext';

const Scheduling = () => {
  const navigate = useNavigate();
  
  return (
    <StaffManagementProvider>
      <SchedulingProvider>
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
          {/* 動態背景漸層 - 與首頁一致的淡藍色調 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100/30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-200/15 via-transparent to-transparent"></div>
          
          {/* 浮動光點效果 - 調整為藍色系 */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse"></div>
          <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-indigo-300/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-200/50 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
          
          <div className="relative z-10 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* 頁面標題卡片 */}
              <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/70 p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/')}
                      className="p-3 backdrop-blur-xl bg-white/40 hover:bg-white/60 border border-white/50 rounded-2xl shadow-lg text-gray-800 md:hidden"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2 drop-shadow-sm">排班管理</h1>
                        <p className="text-gray-600 text-lg font-medium drop-shadow-sm">管理員工排班與時間設定</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg border border-white/30">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg border border-white/30">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 主要內容區域 */}
              <Tabs defaultValue="view" className="w-full">
                {/* 標籤選擇器 */}
                <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/70 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">排班功能</h2>
                  </div>
                  
                  <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/30 rounded-2xl border border-white/40 p-1 shadow-lg h-16">
                    <TabsTrigger 
                      value="view" 
                      className="text-gray-700 data-[state=active]:bg-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="hidden sm:inline">查看班表</span>
                      <span className="sm:hidden">班表</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="create"
                      className="text-gray-700 data-[state=active]:bg-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="hidden sm:inline">創建排班</span>
                      <span className="sm:hidden">排班</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="timeslots"
                      className="text-gray-700 data-[state=active]:bg-white/50 data-[state=active]:text-gray-800 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-4 px-6 text-base flex items-center gap-2 backdrop-blur-xl"
                    >
                      <Clock className="h-5 w-5" />
                      <span className="hidden sm:inline">時間段</span>
                      <span className="sm:hidden">時間</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 內容區域 */}
                <TabsContent value="view" className="mt-0">
                  <ScheduleCalendar />
                </TabsContent>
                <TabsContent value="create" className="mt-0">
                  <ScheduleForm />
                </TabsContent>
                <TabsContent value="timeslots" className="mt-0">
                  <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/70 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">時間段管理</h2>
                    </div>
                    <TimeSlotManagement />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </SchedulingProvider>
    </StaffManagementProvider>
  );
};

export default Scheduling;
