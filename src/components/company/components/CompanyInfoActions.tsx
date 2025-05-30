
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, RefreshCw, Database, Plus, RefreshCcw } from 'lucide-react';
import { Company } from '@/types/company';

interface CompanyInfoActionsProps {
  company: Company | null;
  canEdit: boolean;
  onEdit: () => void;
  onReload: () => void;
  onForceReload: () => Promise<void>;
  onForceSyncFromBackend?: () => Promise<void>;
}

export const CompanyInfoActions: React.FC<CompanyInfoActionsProps> = ({
  company,
  canEdit,
  onEdit,
  onReload,
  onForceReload,
  onForceSyncFromBackend
}) => {
  const handleEditClick = () => {
    console.log('🖊️ CompanyInfoActions: 編輯按鈕被點擊');
    console.log('🖊️ 權限檢查:', { canEdit, company: company?.name });
    
    if (!canEdit) {
      console.warn('⚠️ 用戶沒有編輯權限');
      return;
    }
    
    if (!company) {
      console.warn('⚠️ 沒有公司資料可以編輯');
      return;
    }
    
    console.log('✅ 呼叫編輯功能');
    onEdit();
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {canEdit && (
        <Button
          onClick={handleEditClick}
          size="sm"
          className="flex-1 sm:flex-none"
          type="button"
        >
          {company ? (
            <>
              <Edit className="h-4 w-4 mr-2" />
              編輯資料
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              建立資料
            </>
          )}
        </Button>
      )}
      
      <Button
        onClick={onReload}
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        重新載入
      </Button>
      
      <Button
        onClick={onForceReload}
        variant="outline"
        size="sm"
        className="flex-1 sm:flex-none"
      >
        <Database className="h-4 w-4 mr-2" />
        強制同步
      </Button>

      {onForceSyncFromBackend && (
        <Button
          onClick={onForceSyncFromBackend}
          variant="default"
          size="sm"
          className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          後台同步
        </Button>
      )}
    </div>
  );
};
