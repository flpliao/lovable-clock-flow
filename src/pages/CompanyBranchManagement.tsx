
import React, { useState } from 'react';
import Header from '@/components/Header';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import CompanyManagement from '@/components/company/CompanyManagement';
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
      <div className="flex flex-col min-h-screen bg-white">
        <Header notificationCount={0} />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <Building2 className="h-8 w-8 mr-2 text-blue-600" />
              公司基本資料與營業處管理
            </h1>
            <p className="text-gray-500">管理公司基本資料、各營業處與門市資訊，建立完整組織架構</p>
          </div>
          
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              在此管理公司的基本資料以及各營業處資訊。員工將根據所屬營業處建立權限與主管關係，確保申請流程的正確性。
            </AlertDescription>
          </Alert>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-4">
              <TabsTrigger value="overview">公司與營業處管理</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <CompanyManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </StaffManagementProvider>
  );
};

export default CompanyBranchManagement;
