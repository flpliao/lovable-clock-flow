
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffManagement from '@/components/staff/StaffManagement';
import DepartmentManagement from '@/components/departments/DepartmentManagement';
import { Key, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const PersonnelManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('staff');
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <StaffManagementProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <Header notificationCount={0} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">人員與部門管理</h1>
            <p className="text-gray-500 flex items-center">管理排班系統中的所有員工與部門資料，包含 <Key className="h-4 w-4 ml-1 mr-1 text-blue-500" /> 帳號密碼設定</p>
          </div>
          
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              您可以更改員工的帳號和密碼。更改後，員工將需要使用新的登錄憑據進行登錄。
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="staff">人員及組織</TabsTrigger>
              <TabsTrigger value="departments">部門門市</TabsTrigger>
            </TabsList>
            
            <TabsContent value="staff">
              <StaffManagement />
            </TabsContent>
            
            <TabsContent value="departments">
              <DepartmentManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </StaffManagementProvider>
  );
};

export default PersonnelManagement;
