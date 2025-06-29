
import React, { useState, useEffect } from 'react';
import { permissionService } from '@/services/simplifiedPermissionService';
import { useUser } from '@/contexts/UserContext';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null,
  loading = <div>檢查權限中...</div>
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { currentUser } = useUser();

  useEffect(() => {
    const checkPermission = async () => {
      if (!currentUser) {
        setHasPermission(false);
        return;
      }

      try {
        const result = await permissionService.hasPermission(permission);
        setHasPermission(result);
      } catch (error) {
        console.error('權限檢查失敗:', error);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, [permission, currentUser]);

  if (hasPermission === null) {
    return <>{loading}</>;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// 權限 Hook
export const usePermission = (permission: string) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const checkPermission = async () => {
      if (!currentUser) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await permissionService.hasPermission(permission);
        setHasPermission(result);
      } catch (error) {
        console.error('權限檢查失敗:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [permission, currentUser]);

  return { hasPermission, loading };
};
