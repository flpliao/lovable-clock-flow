
import React from 'react';
import { PositionManagementProvider } from './PositionManagementContext';
import PositionTable from './PositionTable';
import AddPositionDialog from './AddPositionDialog';
import EditPositionDialog from './EditPositionDialog';
import PositionFilters from './PositionFilters';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PositionManagement = () => {
  return (
    <PositionManagementProvider>
      <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-3 text-gray-900">
            <div className="p-2 bg-orange-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            職位管理
          </CardTitle>
          <AddPositionDialog />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <PositionFilters />
          <PositionTable />
        </CardContent>
      </Card>

      <EditPositionDialog />
    </PositionManagementProvider>
  );
};

export default PositionManagement;
