import { useAuth } from '@/hooks/useAuth';
import { protectedRoutes } from '@/routes';
import { iconMap } from './iconMap';

export const useMenuItems = () => {
  const { canAccessRoute } = useAuth();

  // 根據用戶權限過濾路由項目
  const filteredRoutes = protectedRoutes.filter(route => {
    // 如果路由被隱藏，則不顯示
    if (route.isHidden) {
      return false;
    }

    // 如果路由沒有設定角色限制，則所有已登入用戶都可訪問
    if (!route.roles || route.roles.length === 0) {
      return true;
    }

    // 檢查用戶是否有權限訪問此路由
    return canAccessRoute(route.roles);
  });

  // 為過濾後的路由項目加入對應的 icon 元件
  const visibleMenuItems = filteredRoutes.map(route => ({
    ...route,
    iconComponent: route.icon ? iconMap[route.icon as keyof typeof iconMap] : undefined,
  }));

  return { visibleMenuItems };
};
