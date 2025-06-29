
import { supabase } from '@/integrations/supabase/client';

/**
 * 簡化權限服務 - 與新的 RLS 政策兼容
 */
class SimplifiedPermissionService {
  private static instance: SimplifiedPermissionService;
  private permissionCache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 分鐘快取

  static getInstance(): SimplifiedPermissionService {
    if (!SimplifiedPermissionService.instance) {
      SimplifiedPermissionService.instance = new SimplifiedPermissionService();
    }
    return SimplifiedPermissionService.instance;
  }

  /**
   * 檢查當前用戶是否具有指定權限
   */
  async hasPermission(permissionCode: string): Promise<boolean> {
    try {
      const cacheKey = `${permissionCode}`;
      
      // 檢查快取
      if (this.isCacheValid(cacheKey)) {
        const cachedResult = this.permissionCache.get(cacheKey) || false;
        console.log('🎯 權限快取檢查:', permissionCode, '結果:', cachedResult);
        return cachedResult;
      }

      // 使用新的安全函數進行權限檢查
      console.log('🔍 資料庫權限檢查:', permissionCode);
      
      const { data, error } = await supabase.rpc('is_current_user_admin_safe');

      if (error) {
        console.error('❌ 權限檢查錯誤:', error);
        return false;
      }

      const isAdmin = data || false;
      
      // 權限檢查邏輯
      let result = false;
      
      if (isAdmin) {
        // 管理員擁有所有權限
        result = true;
      } else {
        // 基本用戶權限
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
        
        result = basicPermissions.includes(permissionCode);
      }
      
      // 更新快取
      this.updateCache(cacheKey, result);
      
      console.log('✅ 權限檢查結果:', {
        permission: permissionCode,
        isAdmin,
        result
      });
      
      return result;
    } catch (error) {
      console.error('❌ 權限檢查系統錯誤:', error);
      return false;
    }
  }

  /**
   * 檢查是否為管理員
   */
  async isAdmin(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_current_user_admin_safe');
      
      if (error) {
        console.error('❌ 管理員檢查錯誤:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('❌ 管理員檢查系統錯誤:', error);
      return false;
    }
  }

  /**
   * 檢查是否為主管
   */
  async isManager(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_current_user_manager');
      
      if (error) {
        console.error('❌ 主管檢查錯誤:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('❌ 主管檢查系統錯誤:', error);
      return false;
    }
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
   * 清除權限快取
   */
  clearCache(): void {
    console.log('🔄 清除權限快取');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
    
    // 觸發瀏覽器強制刷新快取
    if (typeof window !== 'undefined') {
      // 清除 sessionStorage 中的權限相關快取
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('permission') || key.includes('role') || key.includes('auth'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      // 清除 localStorage 中的權限相關快取
      const localKeysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('permission') || key.includes('role'))) {
          localKeysToRemove.push(key);
        }
      }
      localKeysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('✅ 瀏覽器快取已清除');
    }
  }

  /**
   * 強制清除所有快取並重新載入
   */
  forceRefresh(): void {
    console.log('🔄 強制刷新權限快取');
    this.clearCache();
    
    // 觸發全域事件通知其他組件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('permissionCacheCleared'));
    }
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    return expiry ? Date.now() < expiry : false;
  }

  private updateCache(cacheKey: string, result: boolean): void {
    this.permissionCache.set(cacheKey, result);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
  }
}

// 導出單例實例
export const permissionService = SimplifiedPermissionService.getInstance();
