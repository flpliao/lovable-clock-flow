
import React from 'react';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import { useSupabaseConnectionTest } from './hooks/useSupabaseConnectionTest';
import { useCompanyManagementContext } from './CompanyManagementContext';
import { useDataLoader } from './hooks/useDataLoader';
import { CompanyManagementHeader } from './components/CompanyManagementHeader';
import { CompanyDialogs } from './components/CompanyDialogs';

const CompanyManagement: React.FC = () => {
  const { testSupabaseConnection, isTestingConnection } = useSupabaseConnectionTest();
  const { setIsAddBranchDialogOpen } = useCompanyManagementContext();
  const { refreshData, loading } = useDataLoader();

  const handleRefreshData = async () => {
    console.log('手動重新整理資料...');
    await refreshData();
  };

  const handleAddBranch = () => {
    setIsAddBranchDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <CompanyManagementHeader
        onRefreshData={handleRefreshData}
        onTestConnection={testSupabaseConnection}
        onAddBranch={handleAddBranch}
        loading={loading}
        isTestingConnection={isTestingConnection}
      />

      {/* 公司基本資料 */}
      <CompanyInfoCard />

      {/* 分支機構管理 */}
      <BranchTable />

      {/* 對話框 */}
      <CompanyDialogs />
    </div>
  );
};

export default CompanyManagement;
