
/**
 * 最終版權限 Hook
 * 整合所有安全檢查和權限管理
 */
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { enhancedPermissionService } from '@/services/enhancedPermissionService';
import { securityService } from '@/services/securityService';

export const useFinalPermissions = () => {
  const { currentUser } = useUser();
  const [permissionCache, setPermissionCache] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  // 清除權限快取
  const clearPermissionCache = () => {
    enhancedPermissionService.clearCache();
    setPermissionCache(new Map());
  };

  // 檢查單一權限
  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const result = await enhancedPermissionService.hasPermission(permission);
      
      // 更新本地快取
      setPermissionCache(prev => new Map(prev).set(permission, result));
      
      return result;
    } catch (error) {
      console.error('權限檢查失敗:', error);
      return false;
    }
  };

  // 檢查多個權限（任一個通過即可）
  const hasAnyPermission = async (permissions: string[]): Promise<boolean> => {
    return await enhancedPermissionService.hasAnyPermission(permissions);
  };

  // 檢查所有權限（全部通過才可以）
  const hasAllPermissions = async (permissions: string[]): Promise<boolean> => {
    const results = await Promise.all(
      permissions.map(permission => hasPermission(permission))
    );
    return results.every(result => result);
  };

  // 異步權限檢查
  const hasPermissionAsync = (permission: string) => {
    const [result, setResult] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkPermission = async () => {
        try {
          setLoading(true);
          const hasAccess = await hasPermission(permission);
          setResult(hasAccess);
        } catch (error) {
          console.error('異步權限檢查失敗:', error);
          setResult(false);
        } finally {
          setLoading(false);
        }
      };

      if (currentUser) {
        checkPermission();
      } else {
        setResult(false);
        setLoading(false);
      }
    }, [permission, currentUser]);

    return { hasPermission: result, loading };
  };

  // 檢查是否為管理員
  const isAdmin = async (): Promise<boolean> => {
    return await enhancedPermissionService.isAdmin();
  };

  // 檢查是否為主管
  const isManager = async (): Promise<boolean> => {
    return await enhancedPermissionService.isManager();
  };

  // 監聽權限快取清除事件
  useEffect(() => {
    const handleCacheCleared = () => {
      setPermissionCache(new Map());
    };

    window.addEventListener('permissionCacheCleared', handleCacheCleared);
    
    return () => {
      window.removeEventListener('permissionCacheCleared', handleCacheCleared);
    };
  }, []);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasPermissionAsync,
    isAdmin,
    isManager,
    clearPermissionCache,
    currentUser,
    isLoading
  };
};
