
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

export class PermissionSyncManager {
  private static instance: PermissionSyncManager;
  private syncCallbacks: (() => void)[] = [];

  static getInstance(): PermissionSyncManager {
    if (!PermissionSyncManager.instance) {
      PermissionSyncManager.instance = new PermissionSyncManager();
    }
    return PermissionSyncManager.instance;
  }

  /**
   * 註冊同步回調函數
   */
  registerSyncCallback(callback: () => void): () => void {
    this.syncCallbacks.push(callback);
    
    // 返回取消註冊函數
    return () => {
      const index = this.syncCallbacks.indexOf(callback);
      if (index > -1) {
        this.syncCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 觸發權限同步
   */
  triggerSync(reason: string = 'manual'): void {
    console.log('🔄 觸發權限同步:', reason);
    
    // 清除統一權限服務的快取
    const permissionService = UnifiedPermissionService.getInstance();
    permissionService.clearCache();
    
    // 執行所有註冊的同步回調
    this.syncCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('權限同步回調執行失敗:', error);
      }
    });
    
    console.log('✅ 權限同步完成，已通知', this.syncCallbacks.length, '個組件');
  }

  /**
   * 角色更新時觸發同步
   */
  onRoleUpdate(roleId: string, roleName: string): void {
    this.triggerSync(`role_update:${roleName}`);
  }

  /**
   * 員工角色變更時觸發同步
   */
  onStaffRoleChange(staffId: string, oldRoleId: string, newRoleId: string): void {
    this.triggerSync(`staff_role_change:${staffId}`);
  }

  /**
   * 用戶登入/登出時觸發同步
   */
  onUserAuthChange(userId: string | null): void {
    this.triggerSync(`auth_change:${userId || 'logout'}`);
  }
}
