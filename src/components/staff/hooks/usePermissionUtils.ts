
import { StaffRole, Staff } from '../types';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { useUser } from '@/contexts/UserContext';

export const usePermissionUtils = (roles: StaffRole[]) => {
  const { currentUser } = useUser();
  const permissionService = UnifiedPermissionService.getInstance();

  // Get a role by ID
  const getRole = (roleId?: string): StaffRole | undefined => {
    if (!roleId) return undefined;
    return roles.find(role => role.id === roleId);
  };
  
  // 使用統一權限系統進行權限檢查，基於 role_id
  const hasPermission = (staffList: Staff[], staffId: string, permissionCode: string): boolean => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return false;
    
    // 使用統一權限服務進行檢查，確保使用 role_id
    const context = {
      currentUser,
      staffData: staff,
      roles
    };
    
    const result = permissionService.hasPermission(permissionCode, context);
    
    console.log('🔐 Staff 權限檢查 (基於 role_id):', {
      staff: staff.name,
      roleId: staff.role_id,
      permission: permissionCode,
      result
    });
    
    return result;
  };
  
  // Assign a role to a staff member - 更新 role_id
  const assignRoleToStaff = async (staffId: string, roleId: string): Promise<boolean> => {
    console.log(`分配角色 ${roleId} 給員工 ${staffId} (更新 role_id)`);
    
    // 清除權限快取，因為角色已更改
    permissionService.clearCache();
    
    // 觸發全域權限同步，包含 role_id 更新資訊
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('permissionUpdated', {
        detail: { 
          staffId, 
          roleId, 
          type: 'roleAssigned',
          updatedField: 'role_id' // 明確指出更新的是 role_id
        }
      }));
    }, 100);
    
    return true;
  };

  return { getRole, hasPermission, assignRoleToStaff };
};
