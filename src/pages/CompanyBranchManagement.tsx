
import React from 'react';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { CompanyBranchPermissionGuard } from '@/components/company/components/CompanyBranchPermissionGuard';
import { CompanyBranchLayout } from '@/components/company/components/CompanyBranchLayout';
import { CompanyBranchHeader } from '@/components/company/components/CompanyBranchHeader';
import { CompanyBranchTabs } from '@/components/company/components/CompanyBranchTabs';

const CompanyBranchManagement = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden">
      {/* 動態背景元素 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"></div>
      </div>
      
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
    </div>
  );
};

export default CompanyBranchManagement;
