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
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 開發階段縮短為 2 分鐘
  private readonly ROLES_CACHE_DURATION = 5 * 60 * 1000; // 角色快取縮短為 5 分鐘
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
   * 內部權限檢查邏輯 - 基於 role 欄位
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

    // �廖俊雄擁有所有權限（特殊用戶例外）- 使用正確的 Supabase Auth UID
    if (this.isLiaoJunxiong(currentUser)) {
      console.log('🔐 �廖俊雄權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 基本用戶權限：所有用戶都能查看自己的記錄和申請
    if (this.isBasicUserPermission(permission)) {
      console.log('🔐 基本用戶權限檢查:', currentUser.name, permission, '✅ 允許');
      return true;
    }

    // 檢查員工基於 role 的權限 (改回使用 role)
    if (staffData && this.checkStaffRolePermission(staffData, permission)) {
      console.log('🔐 員工 role 權限檢查:', staffData.name, 'role:', staffData.role, permission, '✅ 允許');
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
   * 檢查是否為廖俊雄 - 使用正確的 Supabase Auth UID
   */
  private isLiaoJunxiong(user: User): boolean {
    return (user.name === '廖俊雄' && 
            user.id === '0765138a-6f11-45f4-be07-dab965116a2d') ||
           user?.email === 'flpliao@gmail.com';
  }

  /**
   * 檢查是否為系統管理員
   */
  private isSystemAdmin(user: User): boolean {
    return user.role === 'admin';
  }

  /**
   * 檢查基本用戶權限（參照請假申請邏輯）
   */
  private isBasicUserPermission(permission: string): boolean {
    const basicPermissions = [
      // 加班基本權限
      'overtime:view_own',
      'overtime:create',
      // 忘記打卡基本權限
      'missed_checkin:view_own',
      'missed_checkin:create',
      // 請假基本權限
      'leave:view_own',
      'leave:create'
    ];
    
    return basicPermissions.includes(permission);
  }

  /**
   * 檢查員工基於 role 的權限（改回使用 role 而非 role_id）
   */
  private checkStaffRolePermission(
    staff: Staff, 
    permission: string
  ): boolean {
    if (!staff.role) {
      console.log('🔐 員工無 role:', staff.name);
      return false;
    }
    
    // 直接基於 role 字串進行權限檢查
    const hasPermission = this.checkRoleBasedPermissions(staff.role, permission);
    
    console.log('🔐 Role 權限檢查:', {
      staff: staff.name,
      role: staff.role,
      permission,
      hasPermission
    });
    
    return hasPermission;
  }

  /**
   * 基於 role 字串的權限檢查
   */
  private checkRoleBasedPermissions(role: string, permission: string): boolean {
    console.log('🔐 檢查 role 權限:', role, permission);
    
    // 管理員擁有所有權限
    if (role === 'admin') {
      return true;
    }
    
    // 管理者權限
    if (role === 'manager') {
      const managerPermissions = [
        // 基本權限
        'overtime:view_own', 'overtime:create',
        'missed_checkin:view_own', 'missed_checkin:create',
        'leave:view_own', 'leave:create',
        // 管理權限
        'overtime:view_all', 'overtime:approve',
        'missed_checkin:view_all', 'missed_checkin:approve',
        'leave:view_all', 'leave:approve',
        'staff:view'
      ];
      return managerPermissions.includes(permission);
    }
    
    // 一般用戶只有基本權限
    if (role === 'user') {
      const userPermissions = [
        'overtime:view_own', 'overtime:create',
        'missed_checkin:view_own', 'missed_checkin:create',
        'leave:view_own', 'leave:create'
      ];
      return userPermissions.includes(permission);
    }
    
    return false;
  }

  /**
   * 基本管理員權限檢查（當無員工資料時的後備方案）
   */
  private checkBasicAdminPermissions(permission: string): boolean {
    // 按照請假申請邏輯，給予完整的管理權限
    const basicAdminPermissions = [
      'system:manage',
      'system:settings_view',
      'system:settings_edit',
      'staff:view',
      'staff:create',
      'staff:edit',
      'staff:delete',
      // 加班管理權限
      'overtime:view_all',
      'overtime:view_own',
      'overtime:create',
      'overtime:approve',
      'overtime:manage',
      // 忘記打卡管理權限
      'missed_checkin:view_all',
      'missed_checkin:view_own',
      'missed_checkin:create',
      'missed_checkin:approve',
      'missed_checkin:manage',
      // 請假管理權限
      'leave:view_all',
      'leave:view_own',
      'leave:create',
      'leave:approve',
      'leave:manage'
    ];
    
    return basicAdminPermissions.includes(permission);
  }

  /**
   * 生成快取鍵 - 改用 role
   */
  private getCacheKey(permission: string, context: UnifiedPermissionContext): string {
    const userId = context.currentUser?.id || 'anonymous';
    const staffId = context.staffData?.id || 'no-staff';
    const userRole = context.currentUser?.role || 'no-role';
    const staffRole = context.staffData?.role || 'no-staff-role';
    return `${userId}-${staffId}-${permission}-${userRole}-${staffRole}`;
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
