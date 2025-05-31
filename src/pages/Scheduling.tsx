
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
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* 手機優化的頁首 */}
          <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sticky top-0 z-10 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="p-2 md:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">排班管理</h1>
                  <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">管理員工排班與時間設定</p>
                </div>
              </div>
            </div>
          </div>

          {/* 主內容區域 */}
          <div className="flex-1 px-3 sm:px-4 py-3 sm:py-6">
            <Tabs defaultValue="view" className="w-full">
              {/* 手機優化的Tab設計 */}
              <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-12 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                <TabsTrigger 
                  value="view" 
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium h-10 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">查看班表</span>
                  <span className="xs:hidden">班表</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="create"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium h-10 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all"
                >
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">創建排班</span>
                  <span className="xs:hidden">排班</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="timeslots"
                  className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-medium h-10 rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all"
                >
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">時間段</span>
                  <span className="xs:hidden">時間</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab內容區域 */}
              <TabsContent value="view" className="mt-0">
                <ScheduleCalendar />
              </TabsContent>
              <TabsContent value="create" className="mt-0">
                <ScheduleForm />
              </TabsContent>
              <TabsContent value="timeslots" className="mt-0">
                <TimeSlotManagement />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SchedulingProvider>
    </StaffManagementProvider>
  );
};

export default Scheduling;
