
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { StaffManagementProvider } from './StaffManagementContext';
import StaffTable from './StaffTable';
import AddStaffDialog from './AddStaffDialog';
import EditStaffDialog from './EditStaffDialog';

const StaffManagement = () => {
  const { isAdmin } = useUser();

  return (
    <StaffManagementProvider>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
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
            <StaffTable />
          </CardContent>
        </Card>

        <EditStaffDialog />
      </div>
    </StaffManagementProvider>
  );
};

export default StaffManagement;
