
import React from 'react';
import { PositionManagementProvider } from './PositionManagementContext';
import PositionTable from './PositionTable';
import AddPositionDialog from './AddPositionDialog';
import EditPositionDialog from './EditPositionDialog';
import PositionFilters from './PositionFilters';
import { Briefcase } from 'lucide-react';

const PositionManagement = () => {
  return (
    <PositionManagementProvider>
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">職位管理</h2>
          </div>
          <AddPositionDialog />
        </div>
        
        <div className="space-y-6">
          <PositionFilters />
          <PositionTable />
        </div>
      </div>

      <EditPositionDialog />
    </PositionManagementProvider>
  );
};

export default PositionManagement;
