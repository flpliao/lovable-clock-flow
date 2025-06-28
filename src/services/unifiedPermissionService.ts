
import { User } from '@/contexts/user/types';
import { Staff, StaffRole } from '@/components/staff/types';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedPermissionContext {
  currentUser: User | null;
  staffData?: Staff;
  roles: StaffRole[];
}

export class UnifiedPermissionService {
  private static instance: UnifiedPermissionService;
  private permissionCache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();
  private rolesCache: StaffRole[] = [];
  private rolesCacheExpiry = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
  private readonly ROLES_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes role cache
  private eventListeners: Set<() => void> = new Set();

  static getInstance(): UnifiedPermissionService {
    if (!UnifiedPermissionService.instance) {
      UnifiedPermissionService.instance = new UnifiedPermissionService();
      UnifiedPermissionService.instance.initializeEventListeners();
    }
    return UnifiedPermissionService.instance;
  }

  private initializeEventListeners(): void {
    // Listen for permission update events
    window.addEventListener('permissionUpdated', this.handlePermissionUpdate.bind(this));
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // Clear cache when page becomes visible to ensure permission sync
        this.clearCache();
      }
    });
  }

  private handlePermissionUpdate(event: CustomEvent): void {
    const { operation, roleData } = event.detail;
    console.log('🔔 Permission update event:', operation);
    
    // Clear related cache
    this.clearCache();
    this.clearRolesCache();
    
    // Notify all listeners
    this.eventListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Permission update listener error:', error);
      }
    });
  }

  private async loadRolesFromBackend(): Promise<StaffRole[]> {
    try {
      // Check if cache is valid
      if (this.rolesCache.length > 0 && Date.now() < this.rolesCacheExpiry) {
        console.log('🎯 Using cached role data');
        return this.rolesCache;
      }
      
      console.log('🔄 Loading role data from backend...');
      
      const { data, error } = await supabase
        .from('staff_roles')
        .select(`
          *,
          role_permissions!inner (
            permission_id,
            permissions!inner (
              id,
              name,
              code,
              description,
              category
            )
          )
        `)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('❌ Failed to load role data:', error.message);
        return this.rolesCache; // Return cached role data
      }
      
      // Convert data format including permissions
      const roles: StaffRole[] = (data || []).map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: (role.role_permissions || []).map((rp: any) => ({
          id: rp.permissions.id,
          name: rp.permissions.name,
          code: rp.permissions.code,
          description: rp.permissions.description || '',
          category: rp.permissions.category || 'general'
        })),
        is_system_role: role.is_system_role || false
      }));
      
      // Update cache
      this.rolesCache = roles;
      this.rolesCacheExpiry = Date.now() + this.ROLES_CACHE_DURATION;
      
      console.log('✅ Role data loaded successfully:', roles.length, 'roles');
      return roles;
      
    } catch (error) {
      console.error('❌ System error loading role data:', error);
      return this.rolesCache; // Return cached role data
    }
  }

  addPermissionUpdateListener(listener: () => void): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  hasPermission(
    permission: string, 
    context: UnifiedPermissionContext
  ): boolean {
    const cacheKey = this.getCacheKey(permission, context);
    
    // Check cache
    if (this.isCacheValid(cacheKey)) {
      const cachedResult = this.permissionCache.get(cacheKey) || false;
      console.log('🎯 Cached permission check:', permission, 'result:', cachedResult);
      return cachedResult;
    }

    const result = this.checkPermissionInternal(permission, context);
    
    // Update cache
    this.updateCache(cacheKey, result);
    
    return result;
  }

  private checkPermissionInternal(
    permission: string, 
    context: UnifiedPermissionContext
  ): boolean {
    const { currentUser, staffData, roles } = context;
    
    if (!currentUser) {
      console.log('🔐 Permission check: User not logged in');
      return false;
    }

    // Role-based permission checking - no hardcoded special users
    if (this.isSystemAdmin(currentUser)) {
      console.log('🔐 System admin permission check:', permission, '✅ Allowed');
      return true;
    }

    // Basic user permissions: all users can view their own records and applications
    if (this.isBasicUserPermission(permission)) {
      console.log('🔐 Basic user permission check:', currentUser.name, permission, '✅ Allowed');
      return true;
    }

    // Check staff dynamic role permissions (main permission check logic)
    if (staffData && this.checkStaffRolePermission(staffData, permission, roles)) {
      console.log('🔐 Staff role permission check:', staffData.name, permission, '✅ Allowed');
      return true;
    }

    // Check direct staff permissions
    if (staffData?.permissions?.includes(permission)) {
      console.log('🔐 Staff direct permission check:', staffData.name, permission, '✅ Allowed');
      return true;
    }

    // If no staff data but is system admin, give basic management permissions
    if (!staffData && this.isSystemAdmin(currentUser)) {
      console.log('🔐 System admin basic permission check:', currentUser.name, permission, '✅ Allowed');
      return this.checkBasicAdminPermissions(permission);
    }

    console.log('🔐 Permission check failed:', currentUser.name, permission, '❌ Denied');
    return false;
  }

  private isSystemAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  private isBasicUserPermission(permission: string): boolean {
    const basicPermissions = [
      // Overtime basic permissions
      'overtime:view_own',
      'overtime:create',
      // Missed check-in basic permissions
      'missed_checkin:view_own',
      'missed_checkin:create',
      // Leave basic permissions
      'leave:view_own',
      'leave:create'
    ];
    
    return basicPermissions.includes(permission);
  }

  private checkStaffRolePermission(
    staff: Staff, 
    permission: string, 
    roles: StaffRole[]
  ): boolean {
    if (!staff.role_id) {
      console.log('🔐 Staff has no role ID:', staff.name);
      return false;
    }
    
    const role = roles.find(r => r.id === staff.role_id);
    if (!role) {
      console.log('🔐 Role not found:', staff.role_id, 'for staff:', staff.name);
      return false;
    }
    
    const hasPermission = role.permissions.some(p => p.code === permission);
    console.log('🔐 Role permission check:', {
      staff: staff.name,
      role: role.name,
      permission,
      hasPermission
    });
    
    return hasPermission;
  }

  private checkBasicAdminPermissions(permission: string): boolean {
    // Give complete management permissions according to leave application logic
    const basicAdminPermissions = [
      'system:manage',
      'system:settings_view',
      'system:settings_edit',
      'staff:view',
      'staff:create',
      'staff:edit',
      'staff:delete',
      // Overtime management permissions
      'overtime:view_all',
      'overtime:view_own',
      'overtime:create',
      'overtime:approve',
      'overtime:manage',
      // Missed check-in management permissions
      'missed_checkin:view_all',
      'missed_checkin:view_own',
      'missed_checkin:create',
      'missed_checkin:approve',
      'missed_checkin:manage',
      // Leave management permissions
      'leave:view_all',
      'leave:view_own',
      'leave:create',
      'leave:approve',
      'leave:manage'
    ];
    
    return basicAdminPermissions.includes(permission);
  }

  private getCacheKey(permission: string, context: UnifiedPermissionContext): string {
    const userId = context.currentUser?.id || 'anonymous';
    const staffId = context.staffData?.id || 'no-staff';
    const roleIds = context.roles.map(r => r.id).sort().join(',');
    const userRole = context.currentUser?.role || 'no-role';
    return `${userId}-${staffId}-${permission}-${roleIds}-${userRole}`;
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    return expiry ? Date.now() < expiry : false;
  }

  private updateCache(cacheKey: string, result: boolean): void {
    this.permissionCache.set(cacheKey, result);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
  }

  clearCache(): void {
    console.log('🔄 Clearing permission cache');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
  }

  clearRolesCache(): void {
    console.log('🔄 Clearing role cache');
    this.rolesCache = [];
    this.rolesCacheExpiry = 0;
  }

  clearUserCache(userId: string): void {
    console.log('🔄 Clearing user permission cache:', userId);
    for (const [key] of this.permissionCache) {
      if (key.startsWith(userId)) {
        this.permissionCache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  forceReload(): void {
    console.log('🔄 Force reloading permissions');
    this.clearCache();
    this.clearRolesCache();
    window.dispatchEvent(new CustomEvent('permissionForceReload'));
  }

  async getCurrentRoles(): Promise<StaffRole[]> {
    return await this.loadRolesFromBackend();
  }
}
