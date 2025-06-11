
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, UserPlus, Clock } from 'lucide-react';
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
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50/30 mobile-fullscreen pt-20 md:pt-24">
          {/* 簡化的背景效果 */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent"></div>
          
          <div className="relative z-10 p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* 簡化的頁面標題 */}
              <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/')}
                      className="p-2 bg-white/50 hover:bg-white/70 border border-white/50 rounded-lg md:hidden"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500 rounded-lg text-white">
                        <Calendar className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">排班管理</h1>
                        <p className="text-sm md:text-base text-gray-600">管理員工排班與時間設定</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 簡化的功能選擇 */}
              <Tabs defaultValue="view" className="w-full">
                <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-4">
                  <TabsList className="grid w-full grid-cols-3 bg-white/50 rounded-lg p-1 h-12">
                    <TabsTrigger 
                      value="view" 
                      className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden sm:inline">查看班表</span>
                      <span className="sm:hidden">班表</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="create"
                      className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">創建排班</span>
                      <span className="sm:hidden">排班</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="timeslots"
                      className="text-gray-700 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium flex items-center gap-2"
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
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-500 rounded-lg text-white">
                        <Clock className="h-5 w-5" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">時間段管理</h2>
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
