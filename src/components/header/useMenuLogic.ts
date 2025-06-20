
import { useMemo } from 'react';
import { User } from '@/contexts/UserContext';
import { menuItems, MenuItem } from './menuConfig';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean) => {
  const getVisibleMenuItems = useMemo((): MenuItem[] => {
    if (!isAuthenticated) return [];
    
    return menuItems.filter(item => {
      // 檢查管理員權限
      if (item.adminOnly && currentUser?.role !== 'admin') {
        // 公告管理特例：HR部門也可以訪問
        if (item.path === '/announcement-management' && currentUser?.department === 'HR') {
          return true;
        }
        return false;
      }
      return !item.public;
    });
  }, [currentUser, isAuthenticated]);

  return { visibleMenuItems: getVisibleMenuItems };
};
