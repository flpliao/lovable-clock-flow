
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
    <div className="px-6 pb-2">
      <Button
        onClick={onEdit}
        variant="outline"
        size="sm"
        className="flex items-center text-xs h-7"
      >
        <Edit className="h-3 w-3 mr-1" />
        編輯
      </Button>
    </div>
  );
};
