
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
          <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="p-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold text-gray-900">排班管理</h1>
              </div>
            </div>
          </div>

          {/* 主內容區域 */}
          <div className="flex-1 p-4">
            <Tabs defaultValue="view" className="w-full">
              {/* 手機優化的Tab設計 */}
              <TabsList className="grid w-full grid-cols-3 mb-6 h-12 bg-white border border-gray-200 rounded-lg p-1">
                <TabsTrigger 
                  value="view" 
                  className="flex items-center justify-center space-x-2 text-sm font-medium h-10 rounded-md data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4" />
                  <span>查看班表</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="create"
                  className="flex items-center justify-center space-x-2 text-sm font-medium h-10 rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>創建排班</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="timeslots"
                  className="flex items-center justify-center space-x-2 text-sm font-medium h-10 rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4" />
                  <span>時間段</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab內容區域 */}
              <TabsContent value="view" className="space-y-4">
                <ScheduleCalendar />
              </TabsContent>
              <TabsContent value="create" className="space-y-4">
                <ScheduleForm />
              </TabsContent>
              <TabsContent value="timeslots" className="space-y-4">
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
