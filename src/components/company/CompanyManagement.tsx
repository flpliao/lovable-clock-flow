
import React from 'react';
import { CompanyManagementProvider } from './CompanyManagementContext';
import CompanyInfoCard from './CompanyInfoCard';
import BranchTable from './BranchTable';
import AddBranchDialog from './AddBranchDialog';
import EditBranchDialog from './EditBranchDialog';
import EditCompanyDialog from './EditCompanyDialog';
import { Button } from '@/components/ui/button';
import { Plus, Database } from 'lucide-react';
import { useSupabaseConnectionTest } from './hooks/useSupabaseConnectionTest';

const CompanyManagement: React.FC = () => {
  const { testSupabaseConnection, isTestingConnection } = useSupabaseConnectionTest();

  return (
    <CompanyManagementProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">公司管理</h1>
            <p className="text-gray-500">管理公司基本資料和分支機構</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={testSupabaseConnection}
              disabled={isTestingConnection}
              variant="outline"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              {isTestingConnection ? '測試中...' : '測試連線'}
            </Button>
          </div>
        </div>

        {/* 公司基本資料 */}
        <CompanyInfoCard />

        {/* 分支機構管理 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">分支機構</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新增分支
            </Button>
          </div>
          <BranchTable />
        </div>

        {/* 對話框 */}
        <AddBranchDialog />
        <EditBranchDialog />
        <EditCompanyDialog />
      </div>
    </CompanyManagementProvider>
  );
};

export default CompanyManagement;
