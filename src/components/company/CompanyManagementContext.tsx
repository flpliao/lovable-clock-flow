
import React, { createContext, useContext, ReactNode } from 'react';
import { CompanyManagementContextType } from '@/types/company';
import { useCompanyManagement } from './useCompanyManagement';

const CompanyManagementContext = createContext<CompanyManagementContextType | undefined>(undefined);

export const CompanyManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const companyManagement = useCompanyManagement();

  return (
    <CompanyManagementContext.Provider value={companyManagement}>
      {children}
    </CompanyManagementContext.Provider>
  );
};

export const useCompanyManagementContext = (): CompanyManagementContextType => {
  const context = useContext(CompanyManagementContext);
  if (context === undefined) {
    throw new Error('useCompanyManagementContext must be used within a CompanyManagementProvider');
  }
  return context;
};
