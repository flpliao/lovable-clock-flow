
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import { DepartmentManagementProvider } from '@/components/departments/DepartmentManagementContext';
import StaffTable from './StaffTable';
import OrganizationChart from './OrganizationChart';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';
import RoleManagement from './RoleManagement';
import AdminVerificationCard from './AdminVerificationCard';
import { Users, UserCheck, Network, Shield } from 'lucide-react';

const StaffManagement = () => {
  console.log('🎯 StaffManagement rendering');
  
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('list');

  return (
    <CompanyManagementProvider>
      <DepartmentManagementProvider>
        <div className="space-y-6">
          <AdminVerificationCard />
          
          {/* 人員管理主區塊 - 半透明設計 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">人員管理</h2>
              </div>
              <AddStaffDialog />
            </div>

            {/* 子標籤 */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/40 backdrop-blur-xl rounded-xl border border-white/30 p-1 mb-6">
                <TabsTrigger 
                  value="list" 
                  className="text-gray-800 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200 py-2 px-4 flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  人員列表
                </TabsTrigger>
                <TabsTrigger 
                  value="org-chart" 
                  className="text-gray-800 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200 py-2 px-4 flex items-center gap-2"
                >
                  <Network className="h-4 w-4" />
                  組織圖
                </TabsTrigger>
                {isAdmin() && (
                  <TabsTrigger 
                    value="roles" 
                    className="text-gray-800 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200 py-2 px-4 flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    權限
                  </TabsTrigger>
                )}
              </TabsList>
              
              <div>
                <TabsContent value="list" className="mt-0">
                  <StaffTable />
                </TabsContent>
                
                <TabsContent value="org-chart" className="mt-0">
                  <OrganizationChart />
                </TabsContent>
                
                {isAdmin() && (
                  <TabsContent value="roles" className="mt-0">
                    <RoleManagement />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>

          <EditStaffDialog />
        </div>
      </DepartmentManagementProvider>
    </CompanyManagementProvider>
  );
};

export default StaffManagement;
