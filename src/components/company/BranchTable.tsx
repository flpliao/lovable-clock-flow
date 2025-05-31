
import React from 'react';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { BranchMobileCard } from './components/BranchMobileCard';
import { BranchDesktopTable } from './components/BranchDesktopTable';
import { BranchEmptyState } from './components/BranchEmptyState';

const BranchTable = () => {
  const { 
    filteredBranches,
    handleDeleteBranch,
    openEditBranchDialog
  } = useCompanyManagementContext();
  
  const { currentUser } = useUser();
  const isMobile = useIsMobile();

  const canManageBranches = currentUser?.name === '廖俊雄' || currentUser?.role === 'admin';

  // 如果沒有營業處資料
  if (filteredBranches.length === 0) {
    return <BranchEmptyState mobile={isMobile} />;
  }

  // 手機版卡片視圖
  if (isMobile) {
    return (
      <div className="space-y-2">
        {filteredBranches.map((branch) => (
          <BranchMobileCard
            key={branch.id}
            branch={branch}
            canManage={canManageBranches}
            onEdit={openEditBranchDialog}
            onDelete={handleDeleteBranch}
          />
        ))}
      </div>
    );
  }

  // 桌面版表格視圖
  return (
    <BranchDesktopTable
      branches={filteredBranches}
      canManage={canManageBranches}
      onEdit={openEditBranchDialog}
      onDelete={handleDeleteBranch}
    />
  );
};

export default BranchTable;
