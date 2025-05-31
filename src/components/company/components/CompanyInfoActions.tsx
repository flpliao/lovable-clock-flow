
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
  canEdit,
  onEdit
}) => {
  if (!canEdit) return null;

  return (
    <div className="px-6 pb-4">
      <Button
        onClick={onEdit}
        variant="outline"
        size="sm"
        className="flex items-center"
      >
        <Edit className="h-4 w-4 mr-2" />
        編輯資料
      </Button>
    </div>
  );
};
