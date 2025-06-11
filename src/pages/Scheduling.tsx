
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, UserPlus, Clock, Users, BarChart3, Settings } from 'lucide-react';
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
        <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
          {/* 動態背景漸層 */}
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-800/90 via-blue-800/70 to-indigo-800/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>
          
          {/* 浮動光點效果 */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse"></div>
          <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-indigo-300/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-slate-300/60 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/50 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
          
          <div className="relative z-10 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* 頁面標題卡片 */}
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/')}
                      className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl shadow-md text-slate-700 md:hidden"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-blue-100">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-slate-800 mb-2">排班管理</h1>
                        <p className="text-slate-600 text-lg font-medium">管理員工排班與時間設定</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg border border-blue-500">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="p-3 bg-emerald-600 rounded-xl shadow-lg border border-emerald-500">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 主要內容區域 */}
              <Tabs defaultValue="view" className="w-full">
                {/* 標籤選擇器 */}
                <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">排班功能</h2>
                  </div>
                  
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-2xl border border-slate-200 p-1 shadow-lg h-14">
                    <TabsTrigger 
                      value="view" 
                      className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">查看班表</span>
                      <span className="sm:hidden">班表</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="create"
                      className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">創建排班</span>
                      <span className="sm:hidden">排班</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="timeslots"
                      className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-md rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
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
                  <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl p-6">
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
