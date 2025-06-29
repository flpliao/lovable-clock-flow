
import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { optimizedPermissionService } from '@/services/optimizedPermissionService';

/**
 * 最終整合的權限 Hook - 階段四完成版
 * 結合資料庫優化和前端快取的權限系統
 */
export const useFinalPermissions = () => {
  const { currentUser, isAdmin: contextIsAdmin, isManager: contextIsManager } = useUser();
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  // 同步權限檢查（基於當前用戶角色的快速檢查）
  const hasQuickPermission = useCallback((permission: string): boolean => {
    if (!currentUser) {
      console.log('🔐 用戶未登入，快速權限檢查失敗:', permission);
      return false;
    }

    // 超級管理員檢查
    if (currentUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      console.log('🔐 超級管理員快速權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 系統管理員權限檢查
    if (contextIsAdmin()) {
      console.log('🔐 系統管理員快速權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 主管權限檢查
    if (contextIsManager() && isManagerPermission(permission)) {
      console.log('🔐 主管快速權限檢查:', permission, '✅ 允許');
      return true;
    }

    // 基本用戶權限檢查
    if (isBasicUserPermission(permission)) {
      console.log('🔐 基本用戶快速權限檢查:', permission, '✅ 允許');
      return true;
    }

    console.log('🔐 快速權限檢查失敗:', currentUser.name, permission, '❌ 拒絕');
    return false;
  }, [currentUser, contextIsAdmin, contextIsManager]);

  // 異步權限檢查（使用優化後的資料庫函數和快取）
  const hasPermissionAsync = useCallback(async (permission: string): Promise<boolean> => {
    if (!currentUser) {
      console.log('🔐 用戶未登入，異步權限檢查失敗:', permission);
      return false;
    }

    try {
      setPermissionsLoading(true);
      const result = await optimizedPermissionService.hasPermission(permission);
      
      console.log('🔐 異步權限檢查結果:', {
        user: currentUser.name,
        permission,
        result
      });
      
      return result;
    } catch (error) {
      console.error('❌ 異步權限檢查錯誤:', error);
      return false;
    } finally {
      setPermissionsLoading(false);
    }
  }, [currentUser]);

  // 批量權限檢查
  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    return permissions.some(permission => hasQuickPermission(permission));
  }, [hasQuickPermission]);

  const hasAllPermissions = useCallback((permissions: string[]): boolean => {
    return permissions.every(permission => hasQuickPermission(permission));
  }, [hasQuickPermission]);

  // 異步批量權限檢查
  const hasAnyPermissionAsync = useCallback(async (permissions: string[]): Promise<boolean> => {
    return await optimizedPermissionService.hasAnyPermission(permissions);
  }, []);

  const hasAllPermissionsAsync = useCallback(async (permissions: string[]): Promise<boolean> => {
    return await optimizedPermissionService.hasAllPermissions(permissions);
  }, []);

  // 角色檢查
  const isAdmin = useCallback((): boolean => {
    return contextIsAdmin();
  }, [contextIsAdmin]);

  const isManager = useCallback((): boolean => {
    return contextIsManager();
  }, [contextIsManager]);

  // 清除權限快取
  const clearPermissionCache = useCallback(async () => {
    console.log('🔄 清除所有權限快取');
    await optimizedPermissionService.refreshCache();
  }, []);

  // 獲取用戶權限列表
  const getUserPermissions = useCallback(async (): Promise<string[]> => {
    return await optimizedPermissionService.getUserPermissions();
  }, []);

  // 獲取 RLS 效能統計
  const getRLSStats = useCallback(async () => {
    return await optimizedPermissionService.getRLSPerformanceStats();
  }, []);

  return {
    // 同步權限檢查（推薦用於 UI 顯示）
    hasPermission: hasQuickPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // 異步權限檢查（用於重要操作前的驗證）
    hasPermissionAsync,
    hasAnyPermissionAsync,
    hasAllPermissionsAsync,
    
    // 角色檢查
    isAdmin,
    isManager,
    
    // 工具方法
    clearPermissionCache,
    getUserPermissions,
    getRLSStats,
    
    // 狀態
    permissionsLoading,
    currentUser
  };
};

// 輔助函數：檢查是否為主管權限
const isManagerPermission = (permission: string): boolean => {
  const managerPermissions = [
    'staff:view_all',
    'leave:view_all',
    'leave:approve',
    'overtime:view_all',
    'overtime:approve',
    'missed_checkin:view_all',
    'missed_checkin:approve'
  ];
  
  return managerPermissions.includes(permission);
};

// 輔助函數：檢查是否為基本用戶權限
const isBasicUserPermission = (permission: string): boolean => {
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
  
  return basicPermissions.includes(permission);
};
