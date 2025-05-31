
import React from 'react';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { CompanyBranchPermissionGuard } from '@/components/company/components/CompanyBranchPermissionGuard';
import { CompanyBranchLayout } from '@/components/company/components/CompanyBranchLayout';
import { CompanyBranchHeader } from '@/components/company/components/CompanyBranchHeader';
import { CompanyBranchTabs } from '@/components/company/components/CompanyBranchTabs';

const CompanyBranchManagement = () => {
  return (
    <CompanyBranchPermissionGuard>
      <StaffManagementProvider>
        <CompanyManagementProvider>
          <CompanyBranchLayout>
            <CompanyBranchHeader />
            <CompanyBranchTabs />
          </CompanyBranchLayout>
        </CompanyManagementProvider>
      </StaffManagementProvider>
    </CompanyBranchPermissionGuard>
  );
};

export default CompanyBranchManagement;
