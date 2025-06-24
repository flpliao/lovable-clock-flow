
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
  
  // Check if a staff has a specific permission - 使用統一權限系統
  const hasPermission = (staffList: Staff[], staffId: string, permissionCode: string): boolean => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return false;
    
    // 使用統一權限服務進行檢查
    const context = {
      currentUser,
      staffData: staff,
      roles
    };
    
    const unifiedResult = permissionService.hasPermission(permissionCode, context);
    
    // 如果統一權限服務返回 true，直接返回
    if (unifiedResult) return true;
    
    // 保持原有的權限檢查邏輯作為後備（向後兼容）
    // Admin has all permissions
    if (staff.role === 'admin') return true;
    
    // Check direct permissions on staff
    if (staff.permissions?.includes(permissionCode)) return true;
    
    // Check role-based permissions
    if (staff.role_id) {
      const role = getRole(staff.role_id);
      if (role) {
        return role.permissions.some(p => p.code === permissionCode);
      }
    }
    
    // For backward compatibility - map old 'user' role to default permissions
    if (staff.role === 'user' && !staff.role_id) {
      const userRole = roles.find(r => r.id === 'user');
      if (userRole) {
        return userRole.permissions.some(p => p.code === permissionCode);
      }
    }
    
    return false;
  };
  
  // Assign a role to a staff member
  const assignRoleToStaff = async (staffId: string, roleId: string): Promise<boolean> => {
    // Implementation would update the staff's role_id in a real application
    // This is a mock implementation for demonstration
    console.log(`Assigned role ${roleId} to staff ${staffId}`);
    
    // 清除權限快取，因為角色已更改
    permissionService.clearCache();
    
    return true;
  };

  return { getRole, hasPermission, assignRoleToStaff };
};
