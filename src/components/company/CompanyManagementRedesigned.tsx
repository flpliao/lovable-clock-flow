
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
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
    <div className={`space-y-3 ${isMobile ? 'space-y-2' : 'space-y-4'}`}>
      {/* 公司基本資料 */}
      <CompanyInfoCard />

      {/* 營業處管理區塊 */}
      <Card className={isMobile ? 'shadow-sm' : ''}>
        <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-4' : 'pb-3'}`}>
          <div className={`flex items-center justify-between ${isMobile ? 'flex-col space-y-2' : ''}`}>
            <CardTitle className={`flex items-center ${isMobile ? 'text-sm w-full justify-center' : 'text-base'}`}>
              <Building2 className={`mr-2 text-blue-600 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              營業處管理 ({branches?.length || 0})
            </CardTitle>
            {canManageBranches && (
              <Button
                onClick={handleAddBranch}
                size={isMobile ? "sm" : "default"}
                className={`flex items-center ${isMobile ? 'w-full justify-center' : ''} ${isMobile ? 'text-xs h-8' : 'text-sm'}`}
              >
                <Plus className={`mr-1 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                新增營業處
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className={`${isMobile ? 'pt-0 px-2' : 'pt-0'}`}>
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
