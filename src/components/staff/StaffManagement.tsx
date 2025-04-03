
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import StaffTable from './StaffTable';
import OrganizationChart from './OrganizationChart';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';

const StaffManagement = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>人員管理</CardTitle>
            <CardDescription>
              {isAdmin() 
                ? "管理排班系統中的所有員工資料" 
                : "查看和管理您自己的員工資料"}
            </CardDescription>
          </div>
          <AddStaffDialog />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="list">人員列表</TabsTrigger>
              <TabsTrigger value="org-chart">公司組織圖</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <StaffTable />
            </TabsContent>
            
            <TabsContent value="org-chart">
              <OrganizationChart />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <EditStaffDialog />
    </div>
  );
};

export default StaffManagement;
