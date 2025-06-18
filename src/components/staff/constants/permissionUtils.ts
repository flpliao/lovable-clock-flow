
import { Permission } from '../types';
import { availablePermissions } from './permissions';

// Get permission categories for grouping in the UI
export const getPermissionCategories = (): string[] => {
  const categories = new Set<string>();
  availablePermissions.forEach(p => categories.add(p.category));
  return Array.from(categories);
};

// Group permissions by category
export const getPermissionsByCategory = (): Record<string, Permission[]> => {
  const groupedPermissions: Record<string, Permission[]> = {};
  
  availablePermissions.forEach(permission => {
    if (!groupedPermissions[permission.category]) {
      groupedPermissions[permission.category] = [];
    }
    groupedPermissions[permission.category].push(permission);
  });
  
  return groupedPermissions;
};
