
import { useMemo } from 'react';
import { User } from '@/contexts/UserContext';
import { menuItems, MenuItem } from './menuConfig';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean) => {
  const { hasPermission, isAdmin } = useUnifiedPermissions();

  const getVisibleMenuItems = useMemo((): MenuItem[] => {
    if (!isAuthenticated) return [];
    
    return menuItems.filter(item => {
      // 檢查管理員權限
      if (item.adminOnly) {
        // 系統管理員直接允許
        if (isAdmin()) {
          return true;
        }
        
        // 檢查特定頁面的權限
        switch (item.path) {
          case '/announcement-management':
            // 公告管理：檢查 HR 部門或公告管理權限
            return currentUser?.department === 'HR' || 
                   hasPermission('announcement:manage') ||
                   hasPermission('hr:manage');
                   
          case '/leave-type-management':
            // 假別管理：檢查假別管理權限
            return hasPermission('leave_type:manage') ||
                   hasPermission('hr:manage');
                   
          case '/hr-management':
            // HR管理：檢查HR管理權限
            return hasPermission('hr:manage') ||
                   currentUser?.department === 'HR';
                   
          case '/holiday-management':
            // 假日管理：檢查假日管理權限
            return hasPermission('holiday:manage') ||
                   hasPermission('system:manage');
                   
          case '/personnel-management':
            // 人員管理：檢查人員管理權限
            return hasPermission('staff:manage') ||
                   hasPermission('hr:manage');
                   
          case '/company-branch-management':
            // 部門管理：檢查部門管理權限
            return hasPermission('department:manage') ||
                   hasPermission('system:manage');
                   
          case '/system-settings':
            // 系統設定：檢查系統管理權限
            return hasPermission('system:manage') ||
                   hasPermission('system:settings_edit');
                   
          case '/scheduling':
            // 排班管理：檢查排班管理權限
            return hasPermission('schedule:manage') ||
                   hasPermission('hr:manage');
                   
          case '/overtime-management':
            // 加班管理：檢查加班管理權限
            return hasPermission('overtime:manage') ||
                   hasPermission('hr:manage');
            
          default:
            // 其他 adminOnly 項目，只允許系統管理員
            return false;
        }
      }
      
      // 非 adminOnly 項目，所有登入用戶都可以看到
      return !item.public;
    });
  }, [currentUser, isAuthenticated, hasPermission, isAdmin]);

  return { visibleMenuItems: getVisibleMenuItems };
};
