import { permissionService } from '@/services/simplifiedPermissionService';
import { User } from '@/stores/userStore';
import { useEffect, useState } from 'react';
import { MenuItem, menuItems } from './menuConfig';

export const useMenuLogic = (currentUser: User | null, isAuthenticated: boolean) => {
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  
  useEffect(() => {
    const filterMenuItems = async () => {
      if (!isAuthenticated || !currentUser) {
        setVisibleItems([]);
        return;
      }
      
      const filteredItems: MenuItem[] = [];
      
      console.log('📋 開始選單權限檢查');
      
      for (const item of menuItems) {
        // 檢查管理員權限
        if (item.adminOnly) {
          // 超級管理員直接允許
          if (currentUser.role_id === 'admin') {
            filteredItems.push(item);
            continue;
          }
          
          // 使用權限服務檢查系統管理權限
          try {
            
            // 公告管理特例：檢查公告管理權限
            if (item.path === '/announcement-management') {
              const hasAnnouncementManage = await permissionService.hasPermission('announcement:create');
              if (hasAnnouncementManage) {
                filteredItems.push(item);
                continue;
              }
            }
          } catch (error) {
            console.error('選單權限檢查錯誤:', error);
          }
          
          continue; // 跳過此項目
        }
        
        // 非管理員限制的項目直接加入
        if (!item.public) {
          filteredItems.push(item);
        }
      }
      
      setVisibleItems(filteredItems);
    };
    
    filterMenuItems();
  }, [currentUser, isAuthenticated]);

  return { visibleMenuItems: visibleItems };
};
