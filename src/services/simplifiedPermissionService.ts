
import { supabase } from '@/integrations/supabase/client';

export class SimplifiedPermissionService {
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
        console.log('🎯 快取權限檢查:', permissionCode, '結果:', cachedResult);
        return cachedResult;
      }

      // 使用資料庫函數進行權限檢查
      console.log('🔍 檢查權限:', permissionCode);
      
      const { data, error } = await supabase.rpc('current_user_has_permission', {
        permission_code: permissionCode
      });

      if (error) {
        console.error('❌ 權限檢查錯誤:', error);
        return false;
      }

      const result = data || false;
      
      // 更新快取
      this.updateCache(cacheKey, result);
      
      console.log('✅ 權限檢查結果:', {
        permission: permissionCode,
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
    return await this.hasPermission('system:admin');
  }

  /**
   * 檢查是否為主管
   */
  async isManager(): Promise<boolean> {
    const hasManagerPermission = await this.hasPermission('leave:approve');
    const isSystemAdmin = await this.isAdmin();
    return hasManagerPermission || isSystemAdmin;
  }

  /**
   * 獲取當前用戶的所有權限
   */
  async getUserPermissions(): Promise<string[]> {
    try {
      console.log('🔍 載入用戶權限列表');
      
      const { data, error } = await supabase
        .from('user_permissions_view')
        .select('permissions')
        .single();

      if (error) {
        console.error('❌ 載入用戶權限失敗:', error);
        return [];
      }

      const permissions = data?.permissions || [];
      console.log('✅ 用戶權限列表載入成功:', permissions);
      return permissions;
    } catch (error) {
      console.error('❌ 載入用戶權限系統錯誤:', error);
      return [];
    }
  }

  /**
   * 清除權限快取
   */
  clearCache(): void {
    console.log('🔄 清除權限快取');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * 清除特定權限的快取
   */
  clearPermissionCache(permissionCode: string): void {
    const cacheKey = `${permissionCode}`;
    this.permissionCache.delete(cacheKey);
    this.cacheExpiry.delete(cacheKey);
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
