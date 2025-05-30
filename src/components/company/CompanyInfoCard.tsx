
import React from 'react';
import { Card } from '@/components/ui/card';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useCompanyOperations } from './hooks/useCompanyOperations';
import { CompanyApiService } from './services/companyApiService';
import { CompanyInfoHeader } from './components/CompanyInfoHeader';
import { CompanyInfoContent } from './components/CompanyInfoContent';
import { CompanyInfoActions } from './components/CompanyInfoActions';
import { CompanyLoadingState } from './components/CompanyLoadingState';
import { CompanyEmptyState } from './components/CompanyEmptyState';

const CompanyInfoCard = () => {
  const { setIsEditCompanyDialogOpen } = useCompanyManagementContext();
  const { company, loading, loadCompany, forceSyncFromBackend } = useCompanyOperations();
  const { isAdmin, currentUser } = useUser();

  console.log('CompanyInfoCard - 當前用戶:', currentUser?.name);
  console.log('CompanyInfoCard - 公司資料載入狀態:', { company: company?.name, loading });
  console.log('CompanyInfoCard - 編輯對話框狀態檢查');

  // 允許廖俊雄和管理員編輯公司資料
  const canEdit = currentUser?.name === '廖俊雄' || isAdmin();

  // 強制重新載入
  const handleForceReload = async () => {
    console.log('🔄 強制重新載入公司資料...');
    const result = await CompanyApiService.forceReload();
    if (result) {
      await loadCompany();
    }
  };

  // 強制從後台同步
  const handleForceSyncFromBackend = async () => {
    console.log('🔄 強制從後台同步公司資料...');
    await forceSyncFromBackend();
  };

  const handleEdit = () => {
    console.log('🖊️ CompanyInfoCard: 開啟編輯公司資料對話框');
    console.log('🖊️ 當前公司資料:', company);
    console.log('🖊️ 用戶權限:', { canEdit, userName: currentUser?.name });
    
    if (!canEdit) {
      console.warn('⚠️ 用戶沒有編輯權限');
      return;
    }
    
    setIsEditCompanyDialogOpen(true);
  };

  // 如果正在載入
  if (loading) {
    return <CompanyLoadingState />;
  }

  // 如果沒有公司資料
  if (!company) {
    return (
      <CompanyEmptyState
        canEdit={canEdit}
        onEdit={handleEdit}
        onReload={loadCompany}
        onForceReload={handleForceReload}
        onForceSyncFromBackend={handleForceSyncFromBackend}
      />
    );
  }

  return (
    <Card>
      <CompanyInfoHeader company={company} loading={loading} />
      <div className="px-6 pb-2">
        <CompanyInfoActions
          company={company}
          canEdit={canEdit}
          onEdit={handleEdit}
          onReload={loadCompany}
          onForceReload={handleForceReload}
          onForceSyncFromBackend={handleForceSyncFromBackend}
        />
      </div>
      <CompanyInfoContent company={company} />
    </Card>
  );
};

export default CompanyInfoCard;
