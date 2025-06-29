
import { supabase } from '@/integrations/supabase/client';

/**
 * 優化後的權限服務 - 階段四
 * 使用資料庫 Materialized View 和優化的 RLS 政策
 */
export class OptimizedPermissionService {
  private static instance: OptimizedPermissionService;
  private permissionCache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 分鐘快取（減少因為有 DB 快取）

  static getInstance(): OptimizedPermissionService {
    if (!OptimizedPermissionService.instance) {
      OptimizedPermissionService.instance = new OptimizedPermissionService();
    }
    return OptimizedPermissionService.instance;
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
        console.log('🎯 前端快取權限檢查:', permissionCode, '結果:', cachedResult);
        return cachedResult;
      }

      // 使用資料庫函數進行權限檢查
      console.log('🔍 資料庫權限檢查:', permissionCode);
      
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
        result,
        cached: false
      });
      
      return result;
    } catch (error) {
      console.error('❌ 權限檢查系統錯誤:', error);
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
   * 檢查所有權限
   */
  async hasAllPermissions(permissions: string[]): Promise<boolean> {
    const results = await Promise.all(
      permissions.map(permission => this.hasPermission(permission))
    );
    return results.every(result => result);
  }

  /**
   * 獲取當前用戶的所有權限（使用安全包裝函數）
   */
  async getUserPermissions(): Promise<string[]> {
    try {
      console.log('🔍 從安全權限函數載入用戶權限列表');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user?.id) {
        console.log('❌ 未找到當前用戶');
        return [];
      }

      // 使用新的安全包裝函數而非直接查詢 Materialized View
      const { data, error } = await supabase.rpc('get_user_permissions_cache', {
        target_user_id: user.user.id
      });

      if (error) {
        console.error('❌ 載入用戶權限失敗:', error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log('❌ 未找到用戶權限記錄');
        return [];
      }

      // 從安全函數結果中取得權限陣列
      const permissions = data[0].permissions || [];
      console.log('✅ 用戶權限列表載入成功:', permissions);
      return Array.isArray(permissions) ? permissions : [];
    } catch (error) {
      console.error('❌ 載入用戶權限系統錯誤:', error);
      return [];
    }
  }

  /**
   * 刷新權限快取
   */
  async refreshCache(): Promise<boolean> {
    try {
      console.log('🔄 刷新權限快取');
      
      // 使用更新後的安全函數刷新資料庫 Materialized View
      const { error } = await supabase.rpc('refresh_user_permissions_cache');
      
      if (error) {
        console.error('❌ 刷新資料庫權限快取失敗:', error);
        return false;
      }
      
      // 清除前端快取
      this.clearCache();
      
      console.log('✅ 權限快取刷新成功');
      return true;
    } catch (error) {
      console.error('❌ 刷新權限快取系統錯誤:', error);
      return false;
    }
  }

  /**
   * 清除前端權限快取
   */
  clearCache(): void {
    console.log('🔄 清除前端權限快取');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * 獲取 RLS 效能統計
   */
  async getRLSPerformanceStats(): Promise<any[]> {
    try {
      console.log('🔍 查詢 RLS 效能統計');
      
      const { data, error } = await supabase
        .from('rls_performance_summary')
        .select('*');

      if (error) {
        console.error('❌ 查詢 RLS 效能統計失敗:', error);
        return [];
      }

      console.log('✅ RLS 效能統計查詢成功:', data);
      return data || [];
    } catch (error) {
      console.error('❌ 查詢 RLS 效能統計系統錯誤:', error);
      return [];
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
export const optimizedPermissionService = OptimizedPermissionService.getInstance();
