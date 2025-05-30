
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useCompanyOperations } from './hooks/useCompanyOperations';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import AddBranchDialog from './AddBranchDialog';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';
import { RLSSettingsCard } from './components/RLSSettingsCard';

const CompanyManagementRedesigned = () => {
  const { currentUser } = useUser();
  const { setIsAddBranchDialogOpen, branches, setIsEditCompanyDialogOpen } = useCompanyManagementContext();
  const { company, loading, loadCompany, forceSyncFromBackend } = useCompanyOperations();
  
  // 允許廖俊雄和管理員管理營業處
  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  console.log('CompanyManagementRedesigned - 當前用戶:', currentUser?.name);
  console.log('CompanyManagementRedesigned - 營業處管理權限:', canManageBranches);
  console.log('CompanyManagementRedesigned - 營業處數量:', branches?.length || 0);

  const handleAddBranch = () => {
    console.log('📍 CompanyManagementRedesigned: 開啟新增營業處對話框');
    setIsAddBranchDialogOpen(true);
  };

  const handleSyncCompany = async () => {
    console.log('🔄 CompanyManagementRedesigned: 執行強制同步');
    await forceSyncFromBackend();
  };

  const handleEditCompany = () => {
    console.log('🖊️ CompanyManagementRedesigned: 開啟編輯公司對話框');
    setIsEditCompanyDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 公司基本資料 */}
      <CompanyInfoCard />

      {/* 營業處管理區塊 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-6 w-6 mr-2 text-blue-600" />
              <CardTitle>營業處管理</CardTitle>
            </div>
            {canManageBranches && (
              <Button
                onClick={handleAddBranch}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                新增營業處
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <BranchTable />
        </CardContent>
      </Card>

      {/* RLS設定區塊 */}
      {canManageBranches && (
        <RLSSettingsCard />
      )}

      {/* 對話框 */}
      <AddBranchDialog />
      <EditBranchDialog />
      <EditCompanyDialog />
    </div>
  );
};

export default CompanyManagementRedesigned;
