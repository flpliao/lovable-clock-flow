
import { StaffRole } from '../types';
import { SYSTEM_ROLES } from './systemRoles';

export const getRoleById = (roleId: string): StaffRole | undefined => {
  return SYSTEM_ROLES.find(role => role.id === roleId);
};

export const getRolesByCategory = (category: string): StaffRole[] => {
  return SYSTEM_ROLES.filter(role => 
    role.permissions.some(permission => permission.category === category)
  );
};

export const getSystemRoles = (): StaffRole[] => {
  return SYSTEM_ROLES.filter(role => role.is_system_role);
};

export const getCustomRoles = (allRoles: StaffRole[]): StaffRole[] => {
  return allRoles.filter(role => !role.is_system_role);
};

export const hasRolePermission = (role: StaffRole, permissionCode: string): boolean => {
  return role.permissions.some(permission => permission.code === permissionCode);
};
