
import { useEffect } from 'react';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';

interface UsePermissionEventListenersProps {
  permissionService: UnifiedPermissionService;
  clearPermissionCache: () => void;
  reloadBackendRoles: () => Promise<void>;
}

export const usePermissionEventListeners = ({
  permissionService,
  clearPermissionCache,
  reloadBackendRoles
}: UsePermissionEventListenersProps) => {
  useEffect(() => {
    const removeListener = permissionService.addPermissionUpdateListener(() => {
      console.log('🔔 權限更新，觸發重新檢查');
      clearPermissionCache();
      reloadBackendRoles();
    });

    const handleForceReload = () => {
      console.log('🔄 收到強制重新載入事件');
      clearPermissionCache();
      reloadBackendRoles();
    };

    window.addEventListener('permissionForceReload', handleForceReload);

    return () => {
      removeListener();
      window.removeEventListener('permissionForceReload', handleForceReload);
    };
  }, [permissionService, clearPermissionCache, reloadBackendRoles]);
};
