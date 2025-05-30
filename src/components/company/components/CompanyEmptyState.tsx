
import React from 'react';
import { Building2, Plus, RefreshCw, Database, RefreshCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyInfoHeader } from './CompanyInfoHeader';

interface CompanyEmptyStateProps {
  canEdit: boolean;
  onEdit: () => void;
  onReload: () => void;
  onForceReload: () => Promise<void>;
  onForceSyncFromBackend?: () => Promise<void>;
}

export const CompanyEmptyState: React.FC<CompanyEmptyStateProps> = ({
  canEdit,
  onEdit,
  onReload,
  onForceReload,
  onForceSyncFromBackend
}) => {
  return (
    <Card>
      <CompanyInfoHeader company={null} loading={false} />
      <CardContent>
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">尚未找到公司資料</h3>
          <p className="text-gray-500 mb-6">後台資料庫中沒有找到依美琦股份有限公司的資料</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onForceSyncFromBackend && (
              <Button
                onClick={onForceSyncFromBackend}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                從後台強制同步
              </Button>
            )}
            
            {canEdit && (
              <Button onClick={onEdit} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                手動建立資料
              </Button>
            )}
            
            <Button onClick={onReload} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              重新載入
            </Button>
            
            <Button onClick={onForceReload} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              強制檢查
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>建議操作順序：</strong><br />
              1. 點擊「從後台強制同步」載入後台資料<br />
              2. 如果仍無資料，可手動建立公司基本資料
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
