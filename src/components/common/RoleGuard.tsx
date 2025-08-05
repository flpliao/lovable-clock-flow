import { useAuth } from '@/hooks/useAuth';
import { RoleGuardProps } from '@/types/auth';
import React from 'react';

/**
 * 角色守衛組件
 * 用於組件級別的權限控制
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredRoles,
  children,
  fallback = null,
  requireAll = false,
}) => {
  const { hasRole, hasAllRoles } = useAuth();

  // 檢查權限
  const hasPermission = requireAll ? hasAllRoles(requiredRoles) : hasRole(requiredRoles);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
