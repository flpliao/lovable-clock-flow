
/**
 * 增強權限服務
 * 使用新的安全 RLS 政策和統一權限檢查
 */
import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';

export class EnhancedPermissionService {
  private static instance: EnhancedPermissionService;
  private permissionCache = new Map<string, { result: boolean; expiry: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘

  static getInstance(): EnhancedPermissionService {
    if (!EnhancedPermissionService.instance) {
      EnhancedPermissionService.instance = new EnhancedPermissionService();
    }
    return EnhancedPermissionService.instance;
  }

  /**
   * 檢查用戶權限
   */
  async hasPermission(permission: string): Promise<boolean> {
    try {
      const cacheKey = `${permission}`;
      
      // 檢查快取
      if (this.isCacheValid(cacheKey)) {
        const cached = this.permissionCache.get(cacheKey);
        console.log('🎯 權限快取命中:', permission, '結果:', cached?.result);
        return cached?.result || false;
      }

      // 驗證用戶身份
      const userValidation = await securityService.validateUser();
      if (!userValidation.isValid) {
        this.updateCache(cacheKey, false);
        return false;
      }

      // 檢查權限
      const hasAccess = await this.checkPermissionLogic(permission, userValidation);
      
      // 更新快取
      this.updateCache(cacheKey, hasAccess);
      
      console.log('✅ 權限檢查結果:', {
        permission,
        user: userValidation.user?.name,
        role: userValidation.role,
        result: hasAccess
      });
      
      return hasAccess;
    } catch (error) {
      console.error('❌ 權限檢查失敗:', error);
      await securityService.logSecurityEvent('permission_check_failed', { permission, error });
      return false;
    }
  }

  /**
   * 權限檢查邏輯
   */
  private async checkPermissionLogic(permission: string, userValidation: any): Promise<boolean> {
    const { role } = userValidation;

    // 超級管理員擁有所有權限
    if (await securityService.isSuperAdmin()) {
      return true;
    }

    // 管理員權限
    if (role === 'admin') {
      return true;
    }

    // 基於角色的權限檢查
    const rolePermissions = {
      'manager': [
        'staff:view', 'staff:edit_own', 'staff:view_team',
        'leave:view', 'leave:create', 'leave:approve',
        'overtime:view', 'overtime:create', 'overtime:approve',
        'announcement:view', 'announcement:create',
        'department:view', 'department:manage_own',
        'schedule:view', 'schedule:create', 'schedule:edit'
      ],
      'user': [
        'staff:view_own', 'staff:edit_own',
        'leave:view_own', 'leave:create',
        'overtime:view_own', 'overtime:create',
        'announcement:view',
        'department:view',
        'schedule:view_own'
      ]
    };

    const allowedPermissions = rolePermissions[role as keyof typeof rolePermissions] || [];
    return allowedPermissions.includes(permission);
  }

  /**
   * 批量權限檢查
   */
  async hasAnyPermission(permissions: string[]): Promise<boolean> {
    const results = await Promise.all(
      permissions.map(permission => this.hasPermission(permission))
    );
    return results.some(result => result);
  }

  /**
   * 檢查是否為管理員
   */
  async isAdmin(): Promise<boolean> {
    return await securityService.isAdmin();
  }

  /**
   * 檢查是否為主管
   */
  async isManager(): Promise<boolean> {
    return await securityService.isManager();
  }

  /**
   * 清除權限快取
   */
  clearCache(): void {
    console.log('🔄 清除權限快取');
    this.permissionCache.clear();
    
    // 觸發全域事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('permissionCacheCleared'));
    }
  }

  /**
   * 檢查快取是否有效
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.permissionCache.get(cacheKey);
    return cached ? Date.now() < cached.expiry : false;
  }

  /**
   * 更新快取
   */
  private updateCache(cacheKey: string, result: boolean): void {
    this.permissionCache.set(cacheKey, {
      result,
      expiry: Date.now() + this.CACHE_DURATION
    });
  }
}

export const enhancedPermissionService = EnhancedPermissionService.getInstance();
