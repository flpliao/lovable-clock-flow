
import { useMemo, useEffect, useState } from 'react';
import { User } from '@/contexts/UserContext';
import { menuItems, MenuItem } from './menuConfig';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean, hasPermission?: (permission: string) => Promise<boolean>) => {
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  
  useEffect(() => {
    const filterMenuItems = async () => {
      console.log('🔍 開始選單權限檢查:', {
        isAuthenticated,
        currentUser: currentUser ? {
          name: currentUser.name,
          role: currentUser.role,
          id: currentUser.id,
          email: currentUser.email
        } : null
      });

      if (!isAuthenticated || !currentUser) {
        console.log('❌ 用戶未認證或不存在，隱藏所有選單');
        setVisibleItems([]);
        return;
      }
      
      const filteredItems: MenuItem[] = [];
      
      for (const item of menuItems) {
        console.log('🔍 檢查選單項目:', item.label, '需要管理員權限:', item.adminOnly);
        
        // 檢查管理員權限
        if (item.adminOnly) {
          // 廖俊雄特殊處理
          if (currentUser.name === '廖俊雄' && 
              currentUser.id === '0765138a-6f11-45f4-be07-dab965116a2d') {
            console.log('✅ 廖俊雄管理員權限:', item.label);
            filteredItems.push(item);
            continue;
          }
          
          // 基於 role 的權限檢查
          if (currentUser.role === 'admin') {
            console.log('✅ 管理員權限通過:', item.label, 'role:', currentUser.role);
            filteredItems.push(item);
            continue;
          }
          
          // 公告管理特例：HR部門也可以訪問
          if (item.path === '/announcement-management' && currentUser.department === 'HR') {
            console.log('✅ HR部門公告管理權限:', item.label);
            filteredItems.push(item);
            continue;
          }
          
          console.log('❌ 沒有管理員權限，跳過:', item.label);
          continue; // 跳過此項目
        }
        
        // 非管理員限制的項目，所有認證用戶都可以訪問
        if (!item.public) {
          console.log('✅ 一般用戶權限通過:', item.label);
          filteredItems.push(item);
        }
      }
      
      console.log('🎯 最終可見選單項目:', filteredItems.map(item => item.label));
      setVisibleItems(filteredItems);
    };
    
    filterMenuItems();
  }, [currentUser, isAuthenticated, hasPermission]);

  return { visibleMenuItems: visibleItems };
};
