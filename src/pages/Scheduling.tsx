
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
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 mobile-fullscreen pt-20 md:pt-24 relative overflow-hidden">
          {/* 動態背景效果 - 與首頁一致 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
          
          {/* 浮動光點效果 */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
          
          <div className="relative z-10 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* 頁面標題卡片 */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
                <div className="flex items-center justify-between">
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
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <Calendar className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">排班管理</h1>
                        <p className="text-white/80 text-lg">管理員工排班與時間設定</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 功能選擇卡片 */}
              <Tabs defaultValue="view" className="w-full">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">功能選擇</h2>
                  </div>
                  
                  <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-xl rounded-2xl p-2 h-16 border border-white/30">
                    <TabsTrigger 
                      value="view" 
                      className="text-white/90 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold flex items-center gap-2 h-12"
                    >
                      <Calendar className="h-5 w-5" />
                      <span className="hidden sm:inline">查看班表</span>
                      <span className="sm:hidden">班表</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="create"
                      className="text-white/90 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold flex items-center gap-2 h-12"
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="hidden sm:inline">創建排班</span>
                      <span className="sm:hidden">排班</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="timeslots"
                      className="text-white/90 data-[state=active]:bg-white/30 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold flex items-center gap-2 h-12"
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
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white/20 rounded-2xl">
                        <Clock className="h-7 w-7 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">時間段管理</h2>
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
