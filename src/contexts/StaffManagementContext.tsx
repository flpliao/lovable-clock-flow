import { useStaffManagement } from '@/components/staff/hooks/useStaffManagement';
import { StaffManagementContextType } from '@/components/staff/types';
import React, { createContext, ReactNode, useContext } from 'react';

const StaffManagementContext = createContext<StaffManagementContextType | undefined>(undefined);

export const StaffManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🔄 StaffManagementProvider rendering...');

  const staffManagement = useStaffManagement();

  console.log('📊 StaffManagement context data:', {
    staffListLength: staffManagement.staffList?.length || 0,
    loading: staffManagement.loading,
  });

  return (
    <StaffManagementContext.Provider value={staffManagement}>
      {children}
    </StaffManagementContext.Provider>
  );
};

export const useStaffManagementContext = (): StaffManagementContextType => {
  console.log('🎯 useStaffManagementContext called');

  const context = useContext(StaffManagementContext);

  if (context === undefined) {
    console.error('❌ StaffManagementContext is undefined - component not wrapped in provider');
    throw new Error('useStaffManagementContext must be used within a StaffManagementProvider');
  }

  console.log('✅ StaffManagementContext found');
  return context;
};
