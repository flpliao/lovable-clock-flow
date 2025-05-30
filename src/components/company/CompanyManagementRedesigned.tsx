
import React from 'react';
import { useCompanySyncManager } from './hooks/useCompanySyncManager';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';
import { CompanySyncCard } from './components/CompanySyncCard';
import BranchTable from './BranchTable';
import { CompanyDialogs } from './components/CompanyDialogs';

const CompanyManagementRedesigned: React.FC = () => {
  const {
    company,
    loading,
    syncStatus,
    loadCompany,
    forceSync,
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

  // 處理建立公司
  const handleCreateCompany = () => {
    setIsEditCompanyDialogOpen(true);
  };

  // 更新公司管理上下文
  React.useEffect(() => {
    if (company) {
      // 這裡可以通知上下文公司資料已更新
      console.log('📋 CompanyManagementRedesigned: 公司資料已更新:', company.name);
    }
  }, [company]);

  return (
    <div className="space-y-6">
      {/* 公司同步管理卡片 */}
      <CompanySyncCard
        company={company}
        loading={loading}
        syncStatus={syncStatus}
        onLoadCompany={loadCompany}
        onForceSync={forceSync}
        onCreateCompany={handleCreateCompany}
        onEditCompany={handleEditCompany}
        canEdit={canEdit}
      />

      {/* 分支機構管理 */}
      {company && <BranchTable />}

      {/* 對話框 */}
      <CompanyDialogs />
    </div>
  );
};

export default CompanyManagementRedesigned;
