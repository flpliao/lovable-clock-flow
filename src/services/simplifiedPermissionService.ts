
import { enhancedPermissionService } from './enhancedPermissionService';

/**
 * 簡化權限服務 - 重定向到增強版本
 * 保持向後兼容性
 */
class SimplifiedPermissionService {
  private static instance: SimplifiedPermissionService;

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
    return await enhancedPermissionService.hasPermission(permissionCode);
  }

  /**
   * 檢查是否為管理員
   */
  async isAdmin(): Promise<boolean> {
    return await enhancedPermissionService.isAdmin();
  }

  /**
   * 檢查是否為主管
   */
  async isManager(): Promise<boolean> {
    return await enhancedPermissionService.isManager();
  }

  /**
   * 批量權限檢查
   */
  async hasAnyPermission(permissions: string[]): Promise<boolean> {
    return await enhancedPermissionService.hasAnyPermission(permissions);
  }

  /**
   * 清除權限快取
   */
  clearCache(): void {
    enhancedPermissionService.clearCache();
  }

  /**
   * 強制清除所有快取並重新載入
   */
  forceRefresh(): void {
    this.clearCache();
    
    // 觸發全域事件通知其他組件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('permissionCacheCleared'));
    }
  }
}

// 導出單例實例
export const permissionService = SimplifiedPermissionService.getInstance();
