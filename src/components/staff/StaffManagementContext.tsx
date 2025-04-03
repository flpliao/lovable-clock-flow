
import React, { createContext, useContext, ReactNode } from 'react';
import { StaffManagementContextType } from './types';
import { useStaffManagement } from './useStaffManagement';

const StaffManagementContext = createContext<StaffManagementContextType | undefined>(undefined);

export const StaffManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const staffManagement = useStaffManagement();

  return (
    <StaffManagementContext.Provider value={staffManagement}>
      {children}
    </StaffManagementContext.Provider>
  );
};

export const useStaffManagementContext = (): StaffManagementContextType => {
  const context = useContext(StaffManagementContext);
  if (context === undefined) {
    throw new Error('useStaffManagementContext must be used within a StaffManagementProvider');
  }
  return context;
};
