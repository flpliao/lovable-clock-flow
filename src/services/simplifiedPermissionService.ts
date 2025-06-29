
import { optimizedPermissionService } from './optimizedPermissionService';

/**
 * 簡化權限服務 - 重新導向到優化版本
 * 保持向後兼容性
 */
export class SimplifiedPermissionService {
  private static instance: SimplifiedPermissionService;

  static getInstance(): SimplifiedPermissionService {
    if (!SimplifiedPermissionService.instance) {
      SimplifiedPermissionService.instance = new SimplifiedPermissionService();
    }
    return SimplifiedPermissionService.instance;
  }

  async hasPermission(permissionCode: string): Promise<boolean> {
    return await optimizedPermissionService.hasPermission(permissionCode);
  }

  async isAdmin(): Promise<boolean> {
    // 先檢查特殊用戶
    const { data: user } = await optimizedPermissionService['supabase'].auth.getUser();
    if (user.user?.email === 'flpliao@gmail.com') {
      console.log('🔐 特殊管理員權限檢查通過:', user.user.email);
      return true;
    }
    
    return await optimizedPermissionService.hasPermission('system:admin');
  }

  async isManager(): Promise<boolean> {
    // 先檢查特殊用戶
    const { data: user } = await optimizedPermissionService['supabase'].auth.getUser();
    if (user.user?.email === 'flpliao@gmail.com') {
      console.log('🔐 特殊主管權限檢查通過:', user.user.email);
      return true;
    }
    
    const hasManagerPermission = await optimizedPermissionService.hasPermission('leave:approve');
    const isSystemAdmin = await this.isAdmin();
    return hasManagerPermission || isSystemAdmin;
  }

  async getUserPermissions(): Promise<string[]> {
    return await optimizedPermissionService.getUserPermissions();
  }

  clearCache(): void {
    optimizedPermissionService.clearCache();
  }
}

// 導出單例實例
export const permissionService = SimplifiedPermissionService.getInstance();
