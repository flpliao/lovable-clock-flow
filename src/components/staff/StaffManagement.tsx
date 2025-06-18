
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import { DepartmentManagementProvider } from '@/components/departments/DepartmentManagementContext';
import StaffTable from './StaffTable';
import OrganizationChart from './OrganizationChart';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';
import RoleManagement from './RoleManagement';
import AdminVerificationCard from './AdminVerificationCard';
import { Users, UserCheck, Network, Shield, Plus } from 'lucide-react';

const StaffManagement = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('list');

  return (
    <CompanyManagementProvider>
      <DepartmentManagementProvider>
        <div className="space-y-6">
          <AdminVerificationCard />
          
          {/* 人員管理主區塊 */}
          <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
                  <Users className="h-5 w-5 text-white" />
                </div>
                人員管理
              </CardTitle>
              <AddStaffDialog />
            </CardHeader>

            <CardContent className="space-y-6">
              {/* 子標籤 */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                  <TabsTrigger 
                    value="list" 
                    className="text-gray-800 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    人員列表
                  </TabsTrigger>
                  <TabsTrigger 
                    value="org-chart" 
                    className="text-gray-800 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                  >
                    <Network className="h-4 w-4" />
                    組織圖
                  </TabsTrigger>
                  {isAdmin() && (
                    <TabsTrigger 
                      value="roles" 
                      className="text-gray-800 data-[state=active]:bg-white/80 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      權限
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <div className="mt-8">
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
            </CardContent>
          </Card>

          <EditStaffDialog />
        </div>
      </DepartmentManagementProvider>
    </CompanyManagementProvider>
  );
};

export default StaffManagement;
