
import { User } from '@/contexts/user/types';
import { Staff, StaffRole } from '@/components/staff/types';

export interface UnifiedPermissionContext {
  currentUser: User | null;
  staffData?: Staff;
  roles: StaffRole[];
}

export interface PermissionCache {
  permissionCache: Map<string, boolean>;
  cacheExpiry: Map<string, number>;
}

export interface RolesCache {
  rolesCache: StaffRole[];
  rolesCacheExpiry: number;
}
