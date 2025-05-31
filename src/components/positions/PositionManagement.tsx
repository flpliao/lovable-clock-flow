
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PositionManagementProvider } from './PositionManagementContext';
import PositionTable from './PositionTable';
import AddPositionDialog from './AddPositionDialog';
import EditPositionDialog from './EditPositionDialog';

const PositionManagement = () => {
  return (
    <PositionManagementProvider>
      <div className="space-y-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">職位管理</CardTitle>
            <AddPositionDialog />
          </CardHeader>
          <CardContent className="pt-0">
            <PositionTable />
          </CardContent>
        </Card>

        <EditPositionDialog />
      </div>
    </PositionManagementProvider>
  );
};

export default PositionManagement;
