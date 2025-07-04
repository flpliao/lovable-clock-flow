import { supabase } from '@/integrations/supabase/client';

/**
 * 簡化權限服務 - 用戶登入時載入權限，同步檢查
 */
class SimplifiedPermissionService {
  private static instance: SimplifiedPermissionService;
  private currentUserPermissions: string[] = []; // 當前用戶的權限列表
  private currentUserRole: string | null = null; // 當前用戶角色
  private isUserPermissionsLoaded = false; // 當前用戶權限是否已載入

  static getInstance(): SimplifiedPermissionService {
    if (!SimplifiedPermissionService.instance) {
      SimplifiedPermissionService.instance = new SimplifiedPermissionService();
    }
    return SimplifiedPermissionService.instance;
  }

  /**
   * 用戶登入時載入權限快取
   */
  async loadUserPermissions(currentUser: { id: string; role_id: string }): Promise<void> {
    try {
      console.log('🔄 用戶登入，載入權限快取...', {
        userId: currentUser.id,
        roleId: currentUser.role_id,
      });

      this.currentUserRole = currentUser.role_id;

      // 管理員擁有所有權限
      if (currentUser.role_id === 'admin') {
        this.currentUserPermissions = ['*']; // 特殊標記表示全部權限
        this.isUserPermissionsLoaded = true;
        console.log('✅ 管理員權限載入完成');
        return;
      }

      // 從資料庫載入用戶權限
      try {
        const { data: rolePermissions, error } = await supabase
          .from('role_permissions')
          .select(
            `
            permissions (
              code
            )
          `
          )
          .eq('role_id', currentUser.role_id);

        if (error) {
          console.warn('⚠️ 無法從資料庫載入權限，使用硬編碼備用方案:', error);
          this.loadHardcodedUserPermissions(currentUser.role_id);
          return;
        }

        // 提取權限代碼
        const permissions =
          rolePermissions
            ?.map((rp: { permissions?: { code?: string } }) => rp.permissions?.code)
            .filter(Boolean) || [];

        if (permissions.length === 0) {
          console.warn('⚠️ 資料庫中沒有該角色的權限，使用硬編碼備用方案');
          this.loadHardcodedUserPermissions(currentUser.role_id);
          return;
        }

        this.currentUserPermissions = permissions;
        this.isUserPermissionsLoaded = true;

        console.log('✅ 用戶權限載入完成:', {
          roleId: currentUser.role_id,
          permissions: permissions,
          count: permissions.length,
        });
      } catch (dbError) {
        console.warn('⚠️ 資料庫查詢失敗，使用硬編碼備用方案:', dbError);
        this.loadHardcodedUserPermissions(currentUser.role_id);
      }
    } catch (error) {
      console.error('❌ 載入用戶權限失敗:', error);
      this.loadHardcodedUserPermissions(currentUser.role_id);
    }
  }

  /**
   * 載入硬編碼用戶權限（備用方案）
   */
  private loadHardcodedUserPermissions(roleId: string): void {
    console.log('🔄 載入硬編碼權限備用方案...', roleId);

    const rolePermissionsMap: Record<string, string[]> = {
      admin: ['*'], // 管理員所有權限
      hr_manager: [
        'staff:view',
        'leave:approve',
        'leave:view',
        'announcement:create',
        'announcement:edit',
        'announcement:delete',
        'announcement:publish',
        'schedule:view_all',
        'schedule:create',
        'schedule:edit',
        'schedule:delete',
      ],
      department_manager: ['staff:view', 'leave:approve', 'leave:view', 'schedule:view_own'],
      manager: [
        'staff:view',
        'leave:approve',
        'leave:view',
        'schedule:view_all',
        'schedule:create',
        'schedule:edit',
        'schedule:delete',
      ],
      user: ['leave:view', 'schedule:view_own'],
    };

    this.currentUserPermissions = rolePermissionsMap[roleId] || [];
    this.isUserPermissionsLoaded = true;

    console.log('✅ 硬編碼權限載入完成:', {
      roleId,
      permissions: this.currentUserPermissions,
    });
  }

  /**
   * 檢查當前用戶是否具有指定權限（同步操作）
   */
  hasPermission(permissionCode: string): boolean {
    // 如果權限未載入，返回 false
    if (!this.isUserPermissionsLoaded) {
      console.warn('⚠️ 用戶權限尚未載入，權限檢查失敗:', permissionCode);
      return false;
    }

    // 管理員擁有所有權限
    if (this.currentUserPermissions.includes('*')) {
      console.log('✅ 管理員權限檢查通過:', permissionCode);
      return true;
    }

    // 檢查具體權限
    const hasPermission = this.currentUserPermissions.includes(permissionCode);

    console.log('🔐 權限檢查:', {
      permission: permissionCode,
      userRole: this.currentUserRole,
      result: hasPermission,
      userPermissions: this.currentUserPermissions,
    });

    return hasPermission;
  }

  /**
   * 異步權限檢查（向後相容）
   */
  async hasPermissionAsync(permissionCode: string): Promise<boolean> {
    // 如果權限未載入，嘗試載入
    if (!this.isUserPermissionsLoaded) {
      console.warn('⚠️ 權限未載入，嘗試異步載入...');
      return false; // 暫時返回 false，避免阻塞
    }
    return this.hasPermission(permissionCode);
  }

  /**
   * 異步載入用戶權限（向後相容）
   */
  async loadUserPermissionsAsync(currentUser: { id: string; role_id: string }): Promise<void> {
    return this.loadUserPermissions(currentUser);
  }

  /**
   * 用戶登出時清除權限快取
   */
  clearUserPermissions(): void {
    console.log('🧹 用戶登出，清除權限快取');
    this.currentUserPermissions = [];
    this.currentUserRole = null;
    this.isUserPermissionsLoaded = false;
  }

  /**
   * 重新載入當前用戶權限（角色變更時使用）
   */
  async reloadCurrentUserPermissions(userId: string, roleId: string): Promise<void> {
    console.log('🔄 重新載入當前用戶權限...', { userId, roleId });
    this.isUserPermissionsLoaded = false;

    await this.loadUserPermissions({
      id: userId,
      role_id: roleId,
    });
  }

  /**
   * 檢查權限是否已載入
   */
  isPermissionsLoaded(): boolean {
    return this.isUserPermissionsLoaded;
  }

  /**
   * 獲取當前用戶權限列表（用於除錯）
   */
  getCurrentUserPermissions(): string[] {
    return [...this.currentUserPermissions];
  }

  /**
   * 獲取當前用戶角色
   */
  getCurrentUserRole(): string | null {
    return this.currentUserRole;
  }

  /**
   * 清除所有快取（相容舊 API）
   */
  clearCache(): void {
    this.clearUserPermissions();
  }

  /**
   * 強制刷新（相容舊 API）
   */
  forceRefresh(): void {
    this.clearUserPermissions();

    // 觸發全域事件通知其他組件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('permissionCacheCleared'));
    }
  }

  /**
   * 檢查是否為管理員（同步）
   */
  isAdmin(): boolean {
    return this.currentUserRole === 'admin';
  }

  /**
   * 檢查是否為主管（同步）
   */
  isManager(): boolean {
    return (
      this.currentUserRole === 'admin' ||
      this.currentUserRole === 'manager' ||
      this.currentUserRole === 'hr_manager' ||
      this.currentUserRole === 'department_manager'
    );
  }
}

// 導出單例實例
export const permissionService = SimplifiedPermissionService.getInstance();
