
import React from 'react';
import { useCompanySyncManager } from './hooks/useCompanySyncManager';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';
import { CompanySyncCard } from './components/CompanySyncCard';
import BranchTable from './BranchTable';
import { CompanyDialogs } from './components/CompanyDialogs';
import AddBranchDialog from './AddBranchDialog';

const CompanyManagementRedesigned: React.FC = () => {
  const {
    company,
    loading,
    loadCompany,
    syncCompany,
    updateCompany
  } = useCompanySyncManager();

  const { 
    setIsEditCompanyDialogOpen,
    handleUpdateCompany
  } = useCompanyManagementContext();

  const { currentUser, isAdmin } = useUser();

  // 權限檢查：允許廖俊雄和管理員編輯
  const canEdit = currentUser?.name === '廖俊雄' || isAdmin();

  // 初始化時載入公司資料
  React.useEffect(() => {
    console.log('🚀 CompanyManagementRedesigned: 初始化載入公司資料');
    loadCompany();
  }, [loadCompany]);

  // 處理編輯公司
  const handleEditCompany = () => {
    setIsEditCompanyDialogOpen(true);
  };

  // 更新公司管理上下文
  React.useEffect(() => {
    if (company) {
      console.log('📋 CompanyManagementRedesigned: 公司資料已更新:', company.name);
    }
  }, [company]);

  return (
    <div className="space-y-6">
      {/* 公司同步管理卡片 */}
      <CompanySyncCard
        company={company}
        loading={loading}
        onLoadCompany={loadCompany}
        onSyncCompany={syncCompany}
        onEditCompany={handleEditCompany}
        canEdit={canEdit}
      />

      {/* 分支機構管理 */}
      {company && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">營業處管理</h2>
            {canEdit && <AddBranchDialog />}
          </div>
          <BranchTable />
        </div>
      )}

      {/* 對話框 */}
      <CompanyDialogs />
    </div>
  );
};

export default CompanyManagementRedesigned;
