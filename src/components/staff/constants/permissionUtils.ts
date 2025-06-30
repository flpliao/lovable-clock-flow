
import { Permission } from '../types';
import { ALL_PERMISSIONS } from './permissions';

export const getPermissionCategories = (): string[] => {
  const categories = new Set<string>();
  ALL_PERMISSIONS.forEach(permission => {
    categories.add(permission.category);
  });
  return Array.from(categories).sort();
};

export const getPermissionsByCategory = (): Record<string, Permission[]> => {
  const categorized: Record<string, Permission[]> = {};
  
  ALL_PERMISSIONS.forEach(permission => {
    const category = permission.category || 'general';
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(permission);
  });
  
  // Sort permissions within each category
  Object.keys(categorized).forEach(category => {
    categorized[category].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  return categorized;
};
