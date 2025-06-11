
import React from 'react';
import { CompanyManagementProvider } from '@/components/company/CompanyManagementContext';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { CompanyBranchPermissionGuard } from '@/components/company/components/CompanyBranchPermissionGuard';
import { CompanyBranchLayout } from '@/components/company/components/CompanyBranchLayout';
import { CompanyBranchHeader } from '@/components/company/components/CompanyBranchHeader';
import { CompanyBranchTabs } from '@/components/company/components/CompanyBranchTabs';

const CompanyBranchManagement = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
      
      {/* 增加額外的頂端間距 */}
      <div className="pt-16 md:pt-20">
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
    </div>
  );
};

export default CompanyBranchManagement;
