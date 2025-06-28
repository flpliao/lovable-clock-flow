
import { StaffRole } from '@/components/staff/types';
import { UnifiedPermissionContext } from './permissions/types';
import { PermissionCacheManager } from './permissions/permissionCache';
import { RolesCacheManager } from './permissions/rolesCache';
import { PermissionEventManager } from './permissions/eventManager';
import { PermissionChecker } from './permissions/permissionChecker';

export { UnifiedPermissionContext } from './permissions/types';

export class UnifiedPermissionService {
  private static instance: UnifiedPermissionService;
  private cacheManager: PermissionCacheManager;
  private rolesManager: RolesCacheManager;
  private eventManager: PermissionEventManager;
  private checker: PermissionChecker;

  private constructor() {
    this.cacheManager = new PermissionCacheManager();
    this.rolesManager = new RolesCacheManager();
    this.eventManager = new PermissionEventManager();
    this.checker = new PermissionChecker();
    this.eventManager.initializeEventListeners();
  }

  static getInstance(): UnifiedPermissionService {
    if (!UnifiedPermissionService.instance) {
      UnifiedPermissionService.instance = new UnifiedPermissionService();
    }
    return UnifiedPermissionService.instance;
  }

  /**
   * 添加權限更新監聽器
   */
  addPermissionUpdateListener(listener: () => void): () => void {
    return this.eventManager.addPermissionUpdateListener(listener);
  }

  /**
   * 統一權限檢查入口
   */
  hasPermission(
    permission: string, 
    context: UnifiedPermissionContext
  ): boolean {
    const cacheKey = this.cacheManager.getCacheKey(permission, context);
    
    // 檢查快取
    if (this.cacheManager.isCacheValid(cacheKey)) {
      const cachedResult = this.cacheManager.getCachedResult(cacheKey) || false;
      console.log('🎯 快取權限檢查:', permission, '結果:', cachedResult);
      return cachedResult;
    }

    const result = this.checker.checkPermissionInternal(permission, context);
    
    // 更新快取
    this.cacheManager.updateCache(cacheKey, result);
    
    return result;
  }

  clearCache(): void {
    this.cacheManager.clearCache();
  }

  clearRolesCache(): void {
    this.rolesManager.clearRolesCache();
  }

  clearUserCache(userId: string): void {
    this.cacheManager.clearUserCache(userId);
  }

  forceReload(): void {
    this.cacheManager.clearCache();
    this.rolesManager.clearRolesCache();
    this.eventManager.forceReload();
  }

  async getCurrentRoles(): Promise<StaffRole[]> {
    return await this.rolesManager.loadRolesFromBackend();
  }
}
