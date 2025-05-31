
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { DepartmentManagementProvider } from './DepartmentManagementContext';
import DepartmentTable from './DepartmentTable';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';

const DepartmentManagement = () => {
  const { isAdmin } = useUser();

  return (
    <DepartmentManagementProvider>
      <div className="space-y-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-1 px-2 sm:px-4">
            <CardTitle className="text-sm sm:text-base">部門門市</CardTitle>
            {isAdmin() && <AddDepartmentDialog />}
          </CardHeader>
          <CardContent className="pt-0 px-2 sm:px-4">
            <DepartmentTable />
          </CardContent>
        </Card>

        <EditDepartmentDialog />
      </div>
    </DepartmentManagementProvider>
  );
};

export default DepartmentManagement;
