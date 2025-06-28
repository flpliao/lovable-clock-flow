
import { useMemo, useEffect, useState } from 'react';
import { User } from '@/contexts/UserContext';
import { menuItems, MenuItem } from './menuConfig';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean, hasPermission?: (permission: string) => Promise<boolean>) => {
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  
  useEffect(() => {
    const filterMenuItems = async () => {
      if (!isAuthenticated) {
        setVisibleItems([]);
        return;
      }
      
      const filteredItems: MenuItem[] = [];
      
      for (const item of menuItems) {
        // 檢查管理員權限
        if (item.adminOnly && currentUser?.role !== 'admin') {
          // 公告管理特例：HR部門也可以訪問
          if (item.path === '/announcement-management' && currentUser?.department === 'HR') {
            filteredItems.push(item);
            continue;
          }
          
          // 如果有權限檢查函數，使用動態權限檢查
          if (hasPermission) {
            const hasAdminPermission = await hasPermission('system:manage');
            if (hasAdminPermission) {
              filteredItems.push(item);
              continue;
            }
          }
          
          continue; // 跳過此項目
        }
        
        if (!item.public) {
          filteredItems.push(item);
        }
      }
      
      setVisibleItems(filteredItems);
    };
    
    filterMenuItems();
  }, [currentUser, isAuthenticated, hasPermission]);

  return { visibleMenuItems: visibleItems };
};
