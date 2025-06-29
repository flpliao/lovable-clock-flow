
import { User } from '@/contexts/user/types';
import { Staff, StaffRole } from '@/components/staff/types';
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedPermissionContext {
  currentUser: User | null;
  staffData?: Staff;
  roles: StaffRole[];
}

/**
 * 統一權限服務 - 重構版，使用新的資料庫函數
 */
export class UnifiedPermissionService {
  private static instance: UnifiedPermissionService;
  private permissionCache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();
  private rolesCache: StaffRole[] = [];
  private rolesCacheExpiry = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘快取
  private readonly ROLES_CACHE_DURATION = 10 * 60 * 1000; // 10 分鐘角色快取

  static getInstance(): UnifiedPermissionService {
    if (!UnifiedPermissionService.instance) {
      UnifiedPermissionService.instance = new UnifiedPermissionService();
    }
    return UnifiedPermissionService.instance;
  }

  /**
   * 主要權限檢查方法 - 使用新的資料庫函數
   */
  hasPermission(permission: string, context: UnifiedPermissionContext): boolean {
    const { currentUser } = context;
    
    if (!currentUser) {
      console.log('🔐 用戶未登入，權限檢查失敗');
      return false;
    }

    // 超級管理員檢查 - 使用正確的 UUID
    if (currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
      console.log('🔐 超級管理員權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 系統管理員權限檢查
    if (this.isSystemAdmin(currentUser)) {
      console.log('🔐 系統管理員權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 基本用戶權限：所有用戶都可以查看自己的記錄和申請
    if (this.isBasicUserPermission(permission)) {
      console.log('🔐 基本用戶權限檢查:', currentUser.name, permission, '✅ 允許');
      return true;
    }

    console.log('🔐 權限檢查失敗:', currentUser.name, permission, '❌ 拒絕');
    return false;
  }

  /**
   * 異步權限檢查 - 使用新的資料庫函數
   */
  async hasPermissionAsync(permission: string): Promise<boolean> {
    try {
      const cacheKey = `${permission}`;
      
      // 檢查快取
      if (this.isCacheValid(cacheKey)) {
        const cachedResult = this.permissionCache.get(cacheKey) || false;
        console.log('🎯 快取權限檢查:', permission, '結果:', cachedResult);
        return cachedResult;
      }

      // 使用新的資料庫函數進行權限檢查
      const { data, error } = await supabase.rpc('is_current_user_admin');
      
      if (error) {
        console.error('❌ 管理員權限檢查錯誤:', error);
        return false;
      }

      const isAdmin = data || false;
      
      // 管理員權限檢查
      if (isAdmin) {
        this.updateCache(cacheKey, true);
        console.log('✅ 管理員權限檢查通過:', permission);
        return true;
      }

      // 檢查主管權限
      const { data: isManagerData, error: managerError } = await supabase.rpc('is_current_user_manager');
      
      if (managerError) {
        console.error('❌ 主管權限檢查錯誤:', managerError);
        return false;
      }

      const isManager = isManagerData || false;
      const result = isManager && this.isManagerPermission(permission);
      
      // 更新快取
      this.updateCache(cacheKey, result);
      
      console.log('✅ 異步權限檢查結果:', {
        permission,
        isAdmin,
        isManager,
        result
      });
      
      return result;
    } catch (error) {
      console.error('❌ 異步權限檢查系統錯誤:', error);
      return false;
    }
  }

  private isSystemAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  private isBasicUserPermission(permission: string): boolean {
    const basicPermissions = [
      'staff:view_own',
      'staff:edit_own',
      'leave:view_own',
      'leave:create',
      'overtime:view_own',
      'overtime:create',
      'missed_checkin:view_own',
      'missed_checkin:create',
      'announcement:view',
      'department:view',
      'company:view'
    ];
    
    return basicPermissions.includes(permission);
  }

  private isManagerPermission(permission: string): boolean {
    const managerPermissions = [
      'staff:view_all',
      'leave:approve',
      'overtime:approve',
      'missed_checkin:approve',
      'announcement:create',
      'notification:send'
    ];
    
    return managerPermissions.includes(permission);
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
    console.log('🔄 清除權限快取');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
  }

  clearRolesCache(): void {
    console.log('🔄 清除角色快取');
    this.rolesCache = [];
    this.rolesCacheExpiry = 0;
  }

  async getCurrentRoles(): Promise<StaffRole[]> {
    try {
      // 檢查快取是否有效
      if (this.rolesCache.length > 0 && Date.now() < this.rolesCacheExpiry) {
        console.log('🎯 使用快取角色資料');
        return this.rolesCache;
      }
      
      console.log('🔄 從後端載入角色資料...');
      
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
        console.error('❌ 載入角色資料失敗:', error.message);
        return this.rolesCache;
      }
      
      // 轉換資料格式
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
      
      // 更新快取
      this.rolesCache = roles;
      this.rolesCacheExpiry = Date.now() + this.ROLES_CACHE_DURATION;
      
      console.log('✅ 角色資料載入成功:', roles.length, '個角色');
      return roles;
      
    } catch (error) {
      console.error('❌ 載入角色資料系統錯誤:', error);
      return this.rolesCache;
    }
  }
}
