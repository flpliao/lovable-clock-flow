// 路由工具函數
import { routes } from './api';
import { ApiRouteConfig, RouteConfig } from './types';

// 前端路由工具函數

/**
 * 根據路徑獲取前端路由配置
 */
export const getRouteByPath = (path: string, routes: RouteConfig[]): RouteConfig | undefined => {
  return routes.find(route => route.path === path);
};

/**
 * 檢查路徑是否為前端路由
 */
export const isRoute = (path: string): boolean => {
  return (Object.values(routes) as string[]).includes(path);
};

/**
 * 獲取前端路由的完整路徑（包含父路由）
 */
export const getRouteFullPath = (route: RouteConfig, parentPath = ''): string => {
  if (route.path.startsWith('/')) {
    return route.path;
  }
  return `${parentPath}/${route.path}`.replace(/\/+/g, '/');
};

/**
 * 獲取前端路由的圖示名稱
 */
export const getRouteIcon = (route: RouteConfig): string | undefined => {
  return route.icon;
};

/**
 * 根據路由群組名稱獲取前端路由
 */
export const getRoutesByGroup = (
  groupName: string,
  routeGroups: Array<{ name: string; routes: RouteConfig[] }>
): RouteConfig[] => {
  const group = routeGroups.find(g => g.name === groupName);
  return group ? group.routes : [];
};

// API 路由工具函數

/**
 * 根據路徑獲取 API 路由配置
 */
export const getApiRouteByPath = (
  path: string,
  routes: ApiRouteConfig[]
): ApiRouteConfig | undefined => {
  return routes.find(route => route.path === path);
};

/**
 * 檢查路徑是否為 API 路由
 */
export const isApiRoute = (path: string): boolean => {
  return path.startsWith('/api/');
};

/**
 * 根據方法過濾 API 路由
 */
export const filterApiRoutesByMethod = (
  routes: ApiRouteConfig[],
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
): ApiRouteConfig[] => {
  return routes.filter(route => route.method === method);
};

/**
 * 根據需要認證過濾 API 路由
 */
export const filterApiRoutesByAuth = (
  routes: ApiRouteConfig[],
  requiresAuth: boolean
): ApiRouteConfig[] => {
  return routes.filter(route => route.requiresAuth === requiresAuth);
};

/**
 * 根據角色過濾 API 路由
 */
export const filterApiRoutesByRole = (
  routes: ApiRouteConfig[],
  userRoles: string[]
): ApiRouteConfig[] => {
  return routes.filter(route => {
    if (!route.roles || route.roles.length === 0) {
      return true;
    }
    return route.roles.some(role => userRoles.includes(role));
  });
};

/**
 * 獲取 API 路由的完整 URL
 */
export const getApiRouteFullUrl = (route: ApiRouteConfig, baseUrl = ''): string => {
  return `${baseUrl}${route.path}`;
};

/**
 * 檢查 API 路由是否需要認證
 */
export const requiresApiAuth = (route: ApiRouteConfig): boolean => {
  return route.requiresAuth === true;
};

/**
 * 檢查用戶是否有權限訪問 API 路由
 */
export const hasApiRoutePermission = (route: ApiRouteConfig, userRoles: string[]): boolean => {
  if (!route.roles || route.roles.length === 0) {
    return true;
  }
  return route.roles.some(role => userRoles.includes(role));
};
