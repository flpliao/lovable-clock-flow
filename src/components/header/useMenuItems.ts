import { protectedRoutes } from '@/routes';
import { MenuItemWithIcon } from '@/types/menu';
import { useEffect, useState } from 'react';
import { iconMap } from './iconMap';

export const useMenuItems = () => {
  const [visibleItems, setVisibleItems] = useState<MenuItemWithIcon[]>([]);

  useEffect(() => {
    const filterMenuItems = async () => {
      // 為每個路由項目加入對應的 icon 元件
      const itemsWithIcons: MenuItemWithIcon[] = protectedRoutes.map(route => ({
        ...route,
        iconComponent: route.icon ? iconMap[route.icon as keyof typeof iconMap] : undefined,
      }));

      setVisibleItems(itemsWithIcons);
    };

    filterMenuItems();
  }, []);

  return { visibleMenuItems: visibleItems };
};
