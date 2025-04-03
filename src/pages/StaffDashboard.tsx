
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
          <h1 className="text-2xl font-bold">員工管理儀表板</h1>
          <p className="text-gray-500">管理所有員工、部門和考勤數據</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="analytics">考勤分析</TabsTrigger>
            <TabsTrigger value="staff">人員及組織</TabsTrigger>
            <TabsTrigger value="departments">部門門市</TabsTrigger>
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
