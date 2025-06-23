
import { useMemo } from 'react';
import { User } from '@/contexts/UserContext';
import { getMenuItems, MenuItem } from './menuConfig';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean) => {
  const getVisibleMenuItems = useMemo((): MenuItem[] => {
    if (!isAuthenticated || !currentUser) return [];
    
    return getMenuItems(currentUser.role || 'user');
  }, [currentUser, isAuthenticated]);

  return { visibleMenuItems: getVisibleMenuItems };
};
