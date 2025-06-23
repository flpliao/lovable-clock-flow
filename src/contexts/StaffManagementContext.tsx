
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
      // 簡化版本的權限檢查 - 管理員擁有所有權限
      const staff = staffManagement.staffList.find(s => s.id === staffId);
      if (!staff) return false;
      
      // 系統管理員擁有所有權限
      if (staff.role === 'admin') return true;
      
      // 可以根據需要擴展更複雜的權限檢查邏輯
      return false;
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
