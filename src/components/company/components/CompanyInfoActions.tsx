
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Company } from '@/types/company';

interface CompanyInfoActionsProps {
  company: Company;
  canEdit: boolean;
  onEdit: () => void;
  onReload: () => void;
  onForceReload: () => void;
  onForceSyncFromBackend: () => void;
}

export const CompanyInfoActions: React.FC<CompanyInfoActionsProps> = ({
  company,
  canEdit,
  onEdit
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {canEdit && (
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Edit className="h-4 w-4 mr-2" />
          編輯資料
        </Button>
      )}
    </div>
  );
};
