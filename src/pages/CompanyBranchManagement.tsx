
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2 } from 'lucide-react';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import CompanyManagementRedesigned from '@/components/company/CompanyManagementRedesigned';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const CompanyBranchManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <StaffManagementProvider>
      <CompanyManagementProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <main className="flex-1 p-2 sm:p-3">
            <div className="mb-3">
              <h1 className="text-lg sm:text-xl font-bold flex items-center">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
                公司基本資料與營業處管理
              </h1>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-2">
                <TabsTrigger value="overview">管理</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <CompanyManagementRedesigned />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </CompanyManagementProvider>
    </StaffManagementProvider>
  );
};

export default CompanyBranchManagement;
