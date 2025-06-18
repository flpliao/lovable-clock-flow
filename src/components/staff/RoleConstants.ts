// Re-export all constants and utilities from their respective files
export { availablePermissions } from './constants/permissions';
export { defaultSystemRoles } from './constants/systemRoles';
export { getPermissionCategories, getPermissionsByCategory } from './constants/permissionUtils';

// Keep backward compatibility by exporting everything that was previously available
export type { Permission, StaffRole } from './types';
