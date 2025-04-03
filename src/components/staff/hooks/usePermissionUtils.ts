
import { StaffRole, Staff } from '../types';

export const usePermissionUtils = (roles: StaffRole[]) => {
  // Get a role by ID
  const getRole = (roleId?: string): StaffRole | undefined => {
    if (!roleId) return undefined;
    return roles.find(role => role.id === roleId);
  };
  
  // Check if a staff has a specific permission
  const hasPermission = (staffList: Staff[], staffId: string, permissionCode: string): boolean => {
    const staff = staffList.find(s => s.id === staffId);
    if (!staff) return false;
    
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
    return true;
  };

  return { getRole, hasPermission, assignRoleToStaff };
};
