
import React, { useState } from 'react';
import StaffAnalyticsDashboard from '@/components/staff/StaffAnalyticsDashboard';
import TeamCheckInManagement from '@/components/staff/TeamCheckInManagement';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StaffDashboard = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">員工考勤儀表板</h1>
          <p className="text-gray-500">管理所有員工考勤數據及分析</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="analytics">數據分析</TabsTrigger>
            <TabsTrigger value="check-ins">打卡管理</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="mt-0">
            <StaffAnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="check-ins" className="mt-0">
            <TeamCheckInManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StaffDashboard;
