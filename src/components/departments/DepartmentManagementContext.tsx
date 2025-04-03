
import React, { createContext, useContext, ReactNode } from 'react';
import { DepartmentManagementContextType } from './types';
import { useDepartmentManagement } from './useDepartmentManagement';

const DepartmentManagementContext = createContext<DepartmentManagementContextType | undefined>(undefined);

export const DepartmentManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const departmentManagement = useDepartmentManagement();

  return (
    <DepartmentManagementContext.Provider value={departmentManagement}>
      {children}
    </DepartmentManagementContext.Provider>
  );
};

export const useDepartmentManagementContext = (): DepartmentManagementContextType => {
  const context = useContext(DepartmentManagementContext);
  if (context === undefined) {
    throw new Error('useDepartmentManagementContext must be used within a DepartmentManagementProvider');
  }
  return context;
};
