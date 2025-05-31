
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffManagement from '@/components/staff/StaffManagement';
import DepartmentManagement from '@/components/departments/DepartmentManagement';
import PositionManagement from '@/components/positions/PositionManagement';
import { Users, Building, Briefcase } from 'lucide-react';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const PersonnelManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('staff');
  
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <StaffManagementProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <main className="flex-1 p-2 sm:p-3">
          <div className="mb-3">
            <h1 className="text-lg sm:text-xl font-bold flex items-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
              人員與部門管理
            </h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="staff" className="text-xs sm:text-sm">人員組織</TabsTrigger>
              <TabsTrigger value="departments" className="text-xs sm:text-sm">部門門市</TabsTrigger>
              <TabsTrigger value="positions" className="text-xs sm:text-sm">職位管理</TabsTrigger>
            </TabsList>
            
            <TabsContent value="staff">
              <StaffManagement />
            </TabsContent>
            
            <TabsContent value="departments">
              <DepartmentManagement />
            </TabsContent>
            
            <TabsContent value="positions">
              <PositionManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </StaffManagementProvider>
  );
};

export default PersonnelManagement;
