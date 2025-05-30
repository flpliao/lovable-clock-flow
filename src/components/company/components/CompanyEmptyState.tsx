
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Edit, RefreshCw } from 'lucide-react';

interface CompanyEmptyStateProps {
  canEdit: boolean;
  onEdit: () => void;
  onReload: () => void;
  onForceReload: () => void;
  onForceSyncFromBackend: () => void;
}

export const CompanyEmptyState: React.FC<CompanyEmptyStateProps> = ({
  canEdit,
  onReload
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          公司基本資料
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">尚未載入公司資料</h3>
          <p className="text-gray-500 mb-6">
            請重新載入以獲取公司基本資料
          </p>
          <Button
            onClick={onReload}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新載入
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
