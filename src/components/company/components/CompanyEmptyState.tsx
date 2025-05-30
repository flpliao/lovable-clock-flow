
import React from 'react';
import { Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyInfoHeader } from './CompanyInfoHeader';
import { CompanyInfoActions } from './CompanyInfoActions';

interface CompanyEmptyStateProps {
  canEdit: boolean;
  onEdit: () => void;
  onReload: () => void;
  onForceReload: () => Promise<void>;
}

export const CompanyEmptyState: React.FC<CompanyEmptyStateProps> = ({
  canEdit,
  onEdit,
  onReload,
  onForceReload
}) => {
  return (
    <Card>
      <CompanyInfoHeader company={null} loading={false} />
      <CardContent>
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">前後台資料尚未同步</p>
          <p className="text-xs text-gray-400 mb-4">請重新載入或手動建立公司資料</p>
          <CompanyInfoActions
            company={null}
            canEdit={canEdit}
            onEdit={onEdit}
            onReload={onReload}
            onForceReload={onForceReload}
          />
        </div>
      </CardContent>
    </Card>
  );
};
