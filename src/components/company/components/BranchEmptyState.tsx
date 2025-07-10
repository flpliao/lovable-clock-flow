import { Building2 } from 'lucide-react';
import React from 'react';

interface BranchEmptyStateProps {
  mobile?: boolean;
}

export const BranchEmptyState: React.FC<BranchEmptyStateProps> = ({ mobile = false }) => {
  return (
    <div className={`text-center ${mobile ? 'p-8' : 'p-8'}`}>
      <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className={`text-muted-foreground ${mobile ? 'text-sm' : ''}`}>尚未建立單位資料</p>
      <p className={`text-gray-400 mt-2 ${mobile ? 'text-xs' : 'text-sm'}`}>
        請新增單位以開始管理組織架構
      </p>
    </div>
  );
};
