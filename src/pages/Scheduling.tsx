
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ScheduleCalendar from '@/components/ScheduleCalendar';
import ScheduleForm from '@/components/ScheduleForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffManagement from '@/components/staff/StaffManagement';
import ShiftReminder from '@/components/ShiftReminder';

const Scheduling = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-white p-5">
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

      <ShiftReminder />

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="view">查看班表</TabsTrigger>
          <TabsTrigger value="create">創建排班</TabsTrigger>
          <TabsTrigger value="staff">人員管理</TabsTrigger>
        </TabsList>
        <TabsContent value="view">
          <ScheduleCalendar />
        </TabsContent>
        <TabsContent value="create">
          <ScheduleForm />
        </TabsContent>
        <TabsContent value="staff">
          <StaffManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduling;
