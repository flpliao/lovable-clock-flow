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
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分鐘快取
  private readonly ROLES_CACHE_DURATION = 10 * 60 * 1000; // 角色快取10分鐘
  private eventListeners: Set<() => void> = new Set();

  static getInstance(): UnifiedPermissionService {
    if (!UnifiedPermissionService.instance) {
      UnifiedPermissionService.instance = new UnifiedPermissionService();
      UnifiedPermissionService.instance.initializeEventListeners();
    }
    return UnifiedPermissionService.instance;
  }

  /**
   * 初始化事件監聽器
   */
  private initializeEventListeners(): void {
    // 監聽權限更新事件
    window.addEventListener('permissionUpdated', this.handlePermissionUpdate.bind(this));
    
    // 監聽頁面可見性變化
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        // 頁面變為可見時，清除快取以確保權限同步
        this.clearCache();
      }
    });
  }

  /**
   * 處理權限更新事件
   */
  private handlePermissionUpdate(event: CustomEvent): void {
    const { operation, roleData } = event.detail;
    console.log('🔔 權限更新事件:', operation, roleData);
    
    // 清除相關快取
    this.clearCache();
    this.clearRolesCache();
    
    // 通知所有監聽器
    this.eventListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('權限更新監聽器錯誤:', error);
      }
    });
  }

  /**
   * 從後台載入角色資料
   */
  private async loadRolesFromBackend(): Promise<StaffRole[]> {
    try {
      // 檢查快取是否有效
      if (this.rolesCache.length > 0 && Date.now() < this.rolesCacheExpiry) {
        console.log('🎯 使用角色快取資料');
        return this.rolesCache;
      }
      
      console.log('🔄 從後台載入角色資料...');
      
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
        console.error('❌ 載入角色資料失敗:', error);
        return this.rolesCache; // 返回快取的角色資料
      }
      
      // 轉換資料格式，包含權限
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
      return this.rolesCache; // 返回快取的角色資料
    }
  }

  /**
   * 添加權限更新監聽器
   */
  addPermissionUpdateListener(listener: () => void): () => void {
    this.eventListeners.add(listener);
    return () => {
      this.eventListeners.delete(listener);
    };
  }

  /**
   * 統一權限檢查入口
   */
  hasPermission(
    permission: string, 
    context: UnifiedPermissionContext
  ): boolean {
    const cacheKey = this.getCacheKey(permission, context);
    
    // 檢查快取
    if (this.isCacheValid(cacheKey)) {
      const cachedResult = this.permissionCache.get(cacheKey) || false;
      console.log('🎯 快取權限檢查:', permission, '結果:', cachedResult);
      return cachedResult;
    }

    const result = this.checkPermissionInternal(permission, context);
    
    // 更新快取
    this.updateCache(cacheKey, result);
    
    return result;
  }

  /**
   * 內部權限檢查邏輯 - 完全基於後台角色設定
   */
  private checkPermissionInternal(
    permission: string, 
    context: UnifiedPermissionContext
  ): boolean {
    const { currentUser, staffData, roles } = context;
    
    if (!currentUser) {
      console.log('🔐 權限檢查: 用戶未登入');
      return false;
    }

    // 廖俊雄擁有所有權限（特殊用戶例外）
    if (this.isLiaoJunxiong(currentUser)) {
      console.log('🔐 廖俊雄權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 檢查員工動態角色權限（主要權限檢查邏輯）
    if (staffData && this.checkStaffRolePermission(staffData, permission, roles)) {
      console.log('🔐 員工角色權限檢查:', staffData.name, permission, '✅ 允許');
      return true;
    }

    // 檢查直接員工權限
    if (staffData?.permissions?.includes(permission)) {
      console.log('🔐 員工直接權限檢查:', staffData.name, permission, '✅ 允許');
      return true;
    }

    // 如果沒有員工資料，但是系統管理員，給予基本管理權限
    if (!staffData && this.isSystemAdmin(currentUser)) {
      console.log('🔐 系統管理員基本權限檢查:', currentUser.name, permission, '✅ 允許');
      return this.checkBasicAdminPermissions(permission);
    }

    console.log('🔐 權限檢查失敗:', currentUser.name, permission, '❌ 拒絕');
    return false;
  }

  /**
   * 檢查是否為廖俊雄
   */
  private isLiaoJunxiong(user: User): boolean {
    return user.name === '廖俊雄' && 
           user.id === '550e8400-e29b-41d4-a716-446655440001';
  }

  /**
   * 檢查是否為系統管理員
   */
  private isSystemAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  /**
   * 檢查員工角色權限（主要邏輯）
   */
  private checkStaffRolePermission(
    staff: Staff, 
    permission: string, 
    roles: StaffRole[]
  ): boolean {
    if (!staff.role_id) {
      console.log('🔐 員工無角色ID:', staff.name);
      return false;
    }
    
    const role = roles.find(r => r.id === staff.role_id);
    if (!role) {
      console.log('🔐 找不到角色:', staff.role_id, '員工:', staff.name);
      return false;
    }
    
    const hasPermission = role.permissions.some(p => p.code === permission);
    console.log('🔐 角色權限檢查:', {
      staff: staff.name,
      role: role.name,
      permission,
      hasPermission,
      rolePermissions: role.permissions.map(p => p.code)
    });
    
    return hasPermission;
  }

  /**
   * 基本管理員權限檢查（當無員工資料時的後備方案）
   */
  private checkBasicAdminPermissions(permission: string): boolean {
    // 只給予最基本的系統管理權限
    const basicAdminPermissions = [
      'system:manage',
      'system:settings_view',
      'system:settings_edit',
      'staff:view',
      'staff:create',
      'staff:edit',
      'staff:delete'
    ];
    
    return basicAdminPermissions.includes(permission);
  }

  /**
   * 生成快取鍵
   */
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
    console.log('🔄 清除權限快取');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
  }

  clearRolesCache(): void {
    console.log('🔄 清除角色快取');
    this.rolesCache = [];
    this.rolesCacheExpiry = 0;
  }

  clearUserCache(userId: string): void {
    console.log('🔄 清除用戶權限快取:', userId);
    for (const [key] of this.permissionCache) {
      if (key.startsWith(userId)) {
        this.permissionCache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  forceReload(): void {
    console.log('🔄 強制重新載入權限');
    this.clearCache();
    this.clearRolesCache();
    window.dispatchEvent(new CustomEvent('permissionForceReload'));
  }

  async getCurrentRoles(): Promise<StaffRole[]> {
    return await this.loadRolesFromBackend();
  }
}
