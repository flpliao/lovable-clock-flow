
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
import { Users, UserCheck, Network, Shield, Plus } from 'lucide-react';

const StaffManagement = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('list');

  return (
    <CompanyManagementProvider>
      <DepartmentManagementProvider>
        <div className="space-y-6 mt-6">
          <AdminVerificationCard />
          
          {/* 人員管理主區塊 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/70 rounded-2xl shadow-lg backdrop-blur-xl border border-blue-400/30">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">
                    人員管理
                  </h3>
                  <p className="text-white/80 text-sm mt-1">管理員工資料與組織架構</p>
                </div>
              </div>
              <AddStaffDialog />
            </div>

            {/* 子標籤 */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="backdrop-blur-sm bg-white/10 border border-white/15 rounded-2xl p-4 mb-6">
                <TabsList className="grid w-full grid-cols-3 bg-white/15 rounded-xl h-10">
                  <TabsTrigger 
                    value="list" 
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-md flex items-center gap-2 text-sm"
                  >
                    <UserCheck className="h-3 w-3" />
                    人員列表
                  </TabsTrigger>
                  <TabsTrigger 
                    value="org-chart" 
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-md flex items-center gap-2 text-sm"
                  >
                    <Network className="h-3 w-3" />
                    組織圖
                  </TabsTrigger>
                  {isAdmin() && (
                    <TabsTrigger 
                      value="roles" 
                      className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-md flex items-center gap-2 text-sm"
                    >
                      <Shield className="h-3 w-3" />
                      權限
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>
              
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
            </Tabs>
          </div>

          <EditStaffDialog />
        </div>
      </DepartmentManagementProvider>
    </CompanyManagementProvider>
  );
};

export default StaffManagement;
