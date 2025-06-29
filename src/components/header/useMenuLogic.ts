
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
        if (item.adminOnly) {
          // 超級管理員直接允許
          if (currentUser?.id === '550e8400-e29b-41d4-a716-446655440001') {
            filteredItems.push(item);
            continue;
          }
          
          // 角色管理員檢查
          if (currentUser?.role === 'admin') {
            filteredItems.push(item);
            continue;
          }
          
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
      
      console.log('📋 選單權限檢查結果:', {
        currentUser: currentUser?.name,
        role: currentUser?.role,
        isAdmin: currentUser?.role === 'admin' || currentUser?.id === '550e8400-e29b-41d4-a716-446655440001',
        visibleItemsCount: filteredItems.length,
        visibleItems: filteredItems.map(item => item.label)
      });
      
      setVisibleItems(filteredItems);
    };
    
    filterMenuItems();
  }, [currentUser, isAuthenticated, hasPermission]);

  return { visibleMenuItems: visibleItems };
};
