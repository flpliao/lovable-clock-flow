
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import CompanyManagementRedesigned from '../CompanyManagementRedesigned';

export const CompanyBranchTabs: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full">
      <CompanyManagementRedesigned />
    </div>
  );
};
