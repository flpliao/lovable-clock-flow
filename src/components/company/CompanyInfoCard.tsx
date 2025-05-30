
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
  const { company, loading, loadCompany } = useCompanyOperations();
  const { isAdmin, currentUser } = useUser();

  console.log('CompanyInfoCard - 當前用戶:', currentUser?.name);
  console.log('CompanyInfoCard - 公司資料載入狀態:', { company: company?.name, loading });

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

  const handleEdit = () => setIsEditCompanyDialogOpen(true);

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
        />
      </div>
      <CompanyInfoContent company={company} />
    </Card>
  );
};

export default CompanyInfoCard;
