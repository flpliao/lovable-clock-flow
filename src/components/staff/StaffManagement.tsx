
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import StaffTable from './StaffTable';
import OrganizationChart from './OrganizationChart';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';
import RoleManagement from './RoleManagement';
import AdminVerificationCard from './AdminVerificationCard';

const StaffManagement = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('list');

  return (
    <CompanyManagementProvider>
      <div className="space-y-2">
        <AdminVerificationCard />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">人員管理</CardTitle>
            <AddStaffDialog />
          </CardHeader>
          <CardContent className="pt-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-2 h-8">
                <TabsTrigger value="list" className="text-xs">人員列表</TabsTrigger>
                <TabsTrigger value="org-chart" className="text-xs">組織圖</TabsTrigger>
                {isAdmin() && <TabsTrigger value="roles" className="text-xs">權限</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="list" className="mt-2">
                <StaffTable />
              </TabsContent>
              
              <TabsContent value="org-chart" className="mt-2">
                <OrganizationChart />
              </TabsContent>
              
              {isAdmin() && (
                <TabsContent value="roles" className="mt-2">
                  <RoleManagement />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

        <EditStaffDialog />
      </div>
    </CompanyManagementProvider>
  );
};

export default StaffManagement;
