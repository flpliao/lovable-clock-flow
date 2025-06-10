
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Building } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useIsMobile } from '@/hooks/use-mobile';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import AddBranchDialog from './AddBranchDialog';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';

const CompanyManagementRedesigned = () => {
  const { currentUser } = useUser();
  const { setIsAddBranchDialogOpen, branches } = useCompanyManagementContext();
  const isMobile = useIsMobile();
  
  // 允許廖俊雄和管理員管理營業處
  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  const handleAddBranch = () => {
    setIsAddBranchDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 公司基本資料 */}
      <CompanyInfoCard />

      {/* 營業處管理區塊 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-orange-400/50">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white drop-shadow-md">
                營業處管理 ({branches?.length || 0})
              </h3>
              <p className="text-white/80 text-sm mt-1">管理所有營業處資訊</p>
            </div>
          </div>
          {canManageBranches && (
            <Button
              onClick={handleAddBranch}
              className="bg-blue-500/80 hover:bg-blue-600/80 text-white border-0 rounded-xl shadow-lg backdrop-blur-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              新增營業處
            </Button>
          )}
        </div>
        
        <BranchTable />
      </div>

      {/* 對話框 */}
      <AddBranchDialog />
      <EditBranchDialog />
      <EditCompanyDialog />
    </div>
  );
};

export default CompanyManagementRedesigned;
