
import React, { useState, useEffect } from 'react';
import { enhancedPermissionService } from '@/services/enhancedPermissionService';
import { securityService } from '@/services/securityService';
import { useUser } from '@/contexts/UserContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecurityGuardProps {
  permission?: string;
  resource?: string;
  action?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * 安全守衛元件
 * 提供細粒度的權限控制
 */
export const SecurityGuard: React.FC<SecurityGuardProps> = ({
  permission,
  resource,
  action,
  fallback,
  children
}) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        let accessGranted = false;

        if (permission) {
          // 使用權限碼檢查
          accessGranted = await enhancedPermissionService.hasPermission(permission);
        } else if (resource && action) {
          // 使用資源和操作檢查
          accessGranted = await securityService.checkDataAccess(resource, action);
        } else {
          // 預設檢查基本權限
          accessGranted = true;
        }

        setHasAccess(accessGranted);
        
        // 記錄安全事件
        if (!accessGranted) {
          await securityService.logSecurityEvent('access_denied', {
            permission,
            resource,
            action,
            user: currentUser.name
          });
        }
      } catch (error) {
        console.error('安全檢查失敗:', error);
        setHasAccess(false);
        await securityService.logSecurityEvent('security_check_failed', {
          permission,
          resource,
          action,
          error
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [permission, resource, action, currentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Shield className="h-4 w-4 animate-spin mr-2" />
        <span className="text-sm text-gray-600">檢查權限中...</span>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="border-amber-200 bg-amber-50">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          您沒有足夠的權限訪問此功能
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

/**
 * 權限檢查 Hook
 */
export const usePermissionCheck = (permission: string) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const checkPermission = async () => {
      if (!currentUser) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await enhancedPermissionService.hasPermission(permission);
        setHasPermission(result);
      } catch (error) {
        console.error('權限檢查失敗:', error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPermission();
  }, [permission, currentUser]);

  return { hasPermission, isLoading };
};
