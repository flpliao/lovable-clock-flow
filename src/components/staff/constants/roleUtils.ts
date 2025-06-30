
import { StaffRole, Permission } from '../types';

export const hasRolePermission = (role: StaffRole, permissionCode: string): boolean => {
  return role.permissions.some(permission => permission.code === permissionCode);
};

export const getRolePermissions = (role: StaffRole): Permission[] => {
  return role.permissions;
};

export const getRolePermissionsByCategory = (role: StaffRole): Record<string, Permission[]> => {
  const categorized: Record<string, Permission[]> = {};
  
  role.permissions.forEach(permission => {
    const category = permission.category || 'general';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(permission);
  });
  
  return categorized;
};

export const countRolePermissions = (role: StaffRole): number => {
  return role.permissions.length;
};

export const getRolePermissionCodes = (role: StaffRole): string[] => {
  return role.permissions.map(permission => permission.code);
};
