
import React, { createContext, useContext, ReactNode } from 'react';
import { StaffManagementContextType } from '@/components/staff/types';
import { useStaffManagement } from '@/components/staff/hooks/useStaffManagement';
import { useSupabaseRoleManagement } from '@/components/staff/hooks/useSupabaseRoleManagement';

const StaffManagementContext = createContext<StaffManagementContextType | undefined>(undefined);

export const StaffManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🔄 StaffManagementProvider rendering...');
  
  const staffManagement = useStaffManagement();
  const roleManagement = useSupabaseRoleManagement();
  
  console.log('📊 StaffManagement context data:', {
    staffListLength: staffManagement.staffList?.length || 0,
    rolesLength: roleManagement.roles?.length || 0,
    loading: staffManagement.loading || roleManagement.loading
  });

  // 合併員工管理和角色管理功能
  const combinedContext: StaffManagementContextType = {
    ...staffManagement,
    roles: roleManagement.roles,
    addRole: roleManagement.addRole,
    updateRole: roleManagement.updateRole,
    deleteRole: roleManagement.deleteRole,
    getRole: roleManagement.getRole,
    hasPermission: (staffId: string, permissionCode: string) => {
      // 這裡可以整合 Supabase 的權限檢查
      return roleManagement.hasPermission(staffId, permissionCode);
    },
    assignRoleToStaff: roleManagement.assignRoleToStaff
  };

  return (
    <StaffManagementContext.Provider value={combinedContext}>
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
