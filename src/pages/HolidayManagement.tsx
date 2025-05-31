
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, Settings } from 'lucide-react';
import HolidayCalendar from '@/components/holiday/HolidayCalendar';
import WorkHoursAnalytics from '@/components/holiday/WorkHoursAnalytics';
import HolidaySettings from '@/components/holiday/HolidaySettings';

const HolidayManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('calendar');
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-3 space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold flex items-center justify-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            假日管理
          </h1>
          <p className="text-sm text-gray-600 mt-1">管理法定假日、計算工作時數與休假統計</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 h-auto">
            <TabsTrigger value="calendar" className="text-xs p-2 flex flex-col items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>假日行事曆</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs p-2 flex flex-col items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>工時統計</span>
            </TabsTrigger>
            {isAdmin() && (
              <TabsTrigger value="settings" className="text-xs p-2 flex flex-col items-center gap-1">
                <Settings className="h-3 w-3" />
                <span>假日設定</span>
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="calendar">
            <HolidayCalendar />
          </TabsContent>
          
          <TabsContent value="analytics">
            <WorkHoursAnalytics />
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="settings">
              <HolidaySettings />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default HolidayManagement;
