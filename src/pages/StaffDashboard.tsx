
import React, { useState } from 'react';
import Header from '@/components/Header';
import StaffAnalyticsDashboard from '@/components/staff/StaffAnalyticsDashboard';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffManagement from '@/components/staff/StaffManagement';
import DepartmentManagement from '@/components/departments/DepartmentManagement';

const StaffDashboard = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Only allow admin users to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header notificationCount={0} />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">員工考勤分析儀表板</h1>
          <p className="text-gray-500">查看所有員工的考勤、請假和打卡狀況</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="analytics">考勤分析</TabsTrigger>
            <TabsTrigger value="staff">人員管理</TabsTrigger>
            <TabsTrigger value="departments">部門門市管理</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <StaffAnalyticsDashboard />
          </TabsContent>
          
          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>
          
          <TabsContent value="departments">
            <DepartmentManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StaffDashboard;
