
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { DepartmentManagementProvider } from './DepartmentManagementContext';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';

const DepartmentManagement = () => {
  const { isAdmin } = useUser();

  return (
    <DepartmentManagementProvider>
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>部門/門市管理</CardTitle>
              <CardDescription>
                {isAdmin() 
                  ? "管理所有部門和門市資料" 
                  : "查看部門和門市資料"}
              </CardDescription>
            </div>
            <AddDepartmentDialog />
          </CardHeader>
          <CardContent>
            <DepartmentTable />
          </CardContent>
        </Card>

        <EditDepartmentDialog />
      </div>
    </DepartmentManagementProvider>
  );
};

export default DepartmentManagement;
