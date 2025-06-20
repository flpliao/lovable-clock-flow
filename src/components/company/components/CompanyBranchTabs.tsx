
import React from 'react';
import { DepartmentManagementProvider } from '@/components/departments/DepartmentManagementContext';
import CompanyManagementRedesigned from '../CompanyManagementRedesigned';

export const CompanyBranchTabs: React.FC = () => {
  return (
    <DepartmentManagementProvider>
      <div className="w-full">
        <CompanyManagementRedesigned />
      </div>
    </DepartmentManagementProvider>
  );
};
