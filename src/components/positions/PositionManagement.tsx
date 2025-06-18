
import React from 'react';
import { PositionManagementProvider } from './PositionManagementContext';
import PositionTable from './PositionTable';
import AddPositionDialog from './AddPositionDialog';
import EditPositionDialog from './EditPositionDialog';
import PositionFilters from './PositionFilters';
import { Briefcase, Plus } from 'lucide-react';

const PositionManagement = () => {
  return (
    <PositionManagementProvider>
      <div className="space-y-6">
        {/* 標題和操作區域 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/80 rounded-xl shadow-lg">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">職位管理</h3>
          </div>
          <AddPositionDialog />
        </div>

        {/* 篩選器 */}
        <PositionFilters />
        
        {/* 職位表格 */}
        <PositionTable />

        <EditPositionDialog />
      </div>
    </PositionManagementProvider>
  );
};

export default PositionManagement;
