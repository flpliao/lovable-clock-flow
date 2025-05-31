
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Company } from '@/types/company';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  if (!canEdit) return null;

  return (
    <Button
      onClick={onEdit}
      variant="outline"
      size="sm"
      className={`flex items-center ${isMobile ? 'text-xs h-7 w-full justify-center' : 'text-xs h-7'}`}
    >
      <Edit className={`mr-1 ${isMobile ? 'h-3 w-3' : 'h-3 w-3'}`} />
      編輯公司資料
    </Button>
  );
};
