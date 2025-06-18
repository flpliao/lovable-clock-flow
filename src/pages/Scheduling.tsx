
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, UserPlus, Clock, Users } from 'lucide-react';
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
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
          {/* 動態背景效果 - 與首頁一致 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
          
          {/* 浮動光點效果 */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
          
          <div className="relative z-10 w-full">
            {/* 頁面標題區域 - 與加班管理頁面保持一致的間距 */}
            <div className="w-full px-0 sm:px-4 lg:px-8 pt-32 md:pt-36 pb-4">
              <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl mx-4 shadow-2xl">
                <div className="flex items-center justify-between p-8">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/')}
                      className="p-3 bg-white/20 hover:bg-white/30 border border-white/30 rounded-2xl md:hidden text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">排班管理</h1>
                        <p className="text-white/80 text-lg font-medium drop-shadow-md">管理員工排班與時間設定</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 功能選擇卡片 - 保持50px間距 */}
            <div className="w-full px-0 sm:px-4 lg:px-8" style={{ paddingTop: '50px', paddingBottom: '24px' }}>
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl mx-4 shadow-xl">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/80 rounded-xl flex items-center justify-center shadow-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white drop-shadow-md">功能選擇</h2>
                  </div>
                  
                  <Tabs defaultValue="view" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                      <TabsTrigger 
                        value="view" 
                        className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">查看班表</span>
                        <span className="sm:hidden">班表</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="create"
                        className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span className="hidden sm:inline">創建排班</span>
                        <span className="sm:hidden">排班</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="timeslots"
                        className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        <span className="hidden sm:inline">時間段</span>
                        <span className="sm:hidden">時間</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              {/* 內容區域 */}
              <div className="mt-8">
                <Tabs defaultValue="view" className="w-full">
                  <TabsContent value="view" className="mt-0">
                    <ScheduleCalendar />
                  </TabsContent>
                  <TabsContent value="create" className="mt-0">
                    <ScheduleForm />
                  </TabsContent>
                  <TabsContent value="timeslots" className="mt-0">
                    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl mx-4 shadow-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-500/80 rounded-xl flex items-center justify-center shadow-lg">
                          <Clock className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-white drop-shadow-md">時間段管理</h2>
                      </div>
                      <TimeSlotManagement />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SchedulingProvider>
    </StaffManagementProvider>
  );
};

export default Scheduling;
