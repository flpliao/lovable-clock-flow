
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, RefreshCw, AlertTriangle, Plus } from 'lucide-react';
import { Company } from '@/types/company';
import { CompanyApiService } from '../services/companyApiService';

interface CompanyInfoActionsProps {
  company: Company | null;
  canEdit: boolean;
  onEdit: () => void;
  onReload: () => void;
  onForceReload: () => Promise<void>;
}

export const CompanyInfoActions: React.FC<CompanyInfoActionsProps> = ({
  company,
  canEdit,
  onEdit,
  onReload,
  onForceReload
}) => {
  const isDataSynced = CompanyApiService.isDataSynced(company);

  if (!company) {
    return (
      <div className="flex gap-2 justify-center">
        <Button 
          onClick={onReload}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          重新載入
        </Button>
        <Button 
          onClick={onForceReload}
          variant="outline"
          size="sm"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          強制重新載入
        </Button>
        {canEdit && (
          <Button 
            onClick={onEdit}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            手動建立公司資料
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReload}
      >
        <RefreshCw className="h-4 w-4 mr-1" />
        重新載入
      </Button>
      {!isDataSynced && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onForceReload}
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          修復同步
        </Button>
      )}
      {canEdit && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onEdit}
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-1" />
          編輯
        </Button>
      )}
    </div>
  );
};
