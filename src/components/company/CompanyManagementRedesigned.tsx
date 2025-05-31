
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useCompanyManagementContext } from './CompanyManagementContext';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import AddBranchDialog from './AddBranchDialog';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';

const CompanyManagementRedesigned = () => {
  const { currentUser } = useUser();
  const { setIsAddBranchDialogOpen, branches } = useCompanyManagementContext();
  
  // 允許廖俊雄和管理員管理營業處
  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  const handleAddBranch = () => {
    setIsAddBranchDialogOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* 公司基本資料 */}
      <CompanyInfoCard />

      {/* 營業處管理區塊 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base">
              <Building2 className="h-4 w-4 mr-2 text-blue-600" />
              營業處 ({branches?.length || 0})
            </CardTitle>
            {canManageBranches && (
              <Button
                onClick={handleAddBranch}
                size="sm"
                className="flex items-center text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                新增
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <BranchTable />
        </CardContent>
      </Card>

      {/* 對話框 */}
      <AddBranchDialog />
      <EditBranchDialog />
      <EditCompanyDialog />
    </div>
  );
};

export default CompanyManagementRedesigned;
