
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Database, RefreshCw } from 'lucide-react';

interface CompanyManagementHeaderProps {
  onRefreshData: () => Promise<void>;
  onTestConnection: () => void;
  onAddBranch: () => void;
  loading: boolean;
  isTestingConnection: boolean;
}

export const CompanyManagementHeader: React.FC<CompanyManagementHeaderProps> = ({
  onRefreshData,
  onTestConnection,
  onAddBranch,
  loading,
  isTestingConnection
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">公司管理</h1>
          <p className="text-gray-500">管理公司基本資料和分支機構</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onRefreshData}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '載入中...' : '重新整理'}
          </Button>
          <Button
            onClick={onTestConnection}
            disabled={isTestingConnection}
            variant="outline"
            size="sm"
          >
            <Database className="h-4 w-4 mr-2" />
            {isTestingConnection ? '測試中...' : '測試連線'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">分支機構</h2>
          <Button 
            size="sm"
            onClick={onAddBranch}
          >
            <Plus className="h-4 w-4 mr-2" />
            新增分支
          </Button>
        </div>
      </div>
    </>
  );
};
