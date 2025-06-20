
import { useMemo } from 'react';
import { User } from '@/contexts/UserContext';
import { menuItems, MenuItem } from './menuConfig';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean) => {
  const getVisibleMenuItems = useMemo((): MenuItem[] => {
    if (!isAuthenticated) return [];
    
    return menuItems.filter(item => {
      if (item.adminOnly && currentUser?.role !== 'admin') return false;
      return !item.public;
    });
  }, [currentUser, isAuthenticated]);

  return { visibleMenuItems: getVisibleMenuItems };
};
