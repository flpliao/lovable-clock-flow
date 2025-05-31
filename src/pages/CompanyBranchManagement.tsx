
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2 } from 'lucide-react';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import CompanyManagementRedesigned from '@/components/company/CompanyManagementRedesigned';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { useIsMobile } from '@/hooks/use-mobile';

const CompanyBranchManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <StaffManagementProvider>
      <CompanyManagementProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <main className="flex-1 p-2 sm:p-4 lg:p-6">
            <div className="mb-4 sm:mb-6">
              <h1 className={`font-bold flex items-center ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                <Building2 className={`mr-2 text-blue-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
                <span className={isMobile ? 'text-sm' : ''}>公司基本資料與營業處管理</span>
              </h1>
              {!isMobile && (
                <p className="text-gray-600 text-sm mt-1">管理公司基本資料與營業處資訊</p>
              )}
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full grid-cols-1 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                <TabsTrigger value="overview" className={isMobile ? 'text-sm py-2' : ''}>
                  管理
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-0">
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
