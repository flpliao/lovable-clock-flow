import { useAuth } from '@/hooks/useAuth';
import { routes } from '@/routes/api';
import { RouteConfig } from '@/types/auth';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  route: RouteConfig;
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * 權限控制路由組件
 * 用於檢查用戶是否有權限訪問特定路由
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  route,
  children,
  fallbackPath = '/',
}) => {
  const { canAccessRoute, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace />;
  }

  // 檢查用戶是否有權限訪問此路由
  if (!canAccessRoute(route.roles)) {
    return <Navigate to={fallbackPath || routes.home} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
