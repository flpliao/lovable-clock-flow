
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
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
        <div className="flex flex-col min-h-screen bg-white">
          <div className="p-5">
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">排班管理</h1>
            </div>

            <Tabs defaultValue="view" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="view">查看班表</TabsTrigger>
                <TabsTrigger value="create">創建排班</TabsTrigger>
                <TabsTrigger value="timeslots">時間段管理</TabsTrigger>
              </TabsList>
              <TabsContent value="view">
                <ScheduleCalendar />
              </TabsContent>
              <TabsContent value="create">
                <ScheduleForm />
              </TabsContent>
              <TabsContent value="timeslots">
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
