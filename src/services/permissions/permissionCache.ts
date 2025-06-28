
import { PermissionCache, UnifiedPermissionContext } from './types';

export class PermissionCacheManager {
  private permissionCache = new Map<string, boolean>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for development

  getCacheKey(permission: string, context: UnifiedPermissionContext): string {
    const userId = context.currentUser?.id || 'anonymous';
    const staffId = context.staffData?.id || 'no-staff';
    const userRole = context.currentUser?.role || 'no-role';
    const staffRole = context.staffData?.role || 'no-staff-role';
    return `${userId}-${staffId}-${permission}-${userRole}-${staffRole}`;
  }

  isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey);
    return expiry ? Date.now() < expiry : false;
  }

  getCachedResult(cacheKey: string): boolean | undefined {
    return this.permissionCache.get(cacheKey);
  }

  updateCache(cacheKey: string, result: boolean): void {
    this.permissionCache.set(cacheKey, result);
    this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION);
  }

  clearCache(): void {
    console.log('🔄 清除權限快取');
    this.permissionCache.clear();
    this.cacheExpiry.clear();
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
}
