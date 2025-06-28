
import { useState, useEffect, useMemo } from 'react';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { StaffRole } from '@/components/staff/types';

export const useBackendRoles = () => {
  const [backendRoles, setBackendRoles] = useState<StaffRole[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  const permissionService = useMemo(() => 
    UnifiedPermissionService.getInstance(), []
  );

  // 載入後台角色資料
  useEffect(() => {
    const loadBackendRoles = async () => {
      try {
        setRolesLoading(true);
        console.log('🔄 載入後台角色資料用於權限檢查...');
        const roles = await permissionService.getCurrentRoles();
        setBackendRoles(roles);
        console.log('✅ 後台角色資料載入完成:', roles.length, '個角色');
        console.log('📋 角色詳情:', roles.map(r => ({
          id: r.id,
          name: r.name,
          permissionCount: r.permissions.length
        })));
      } catch (error) {
        console.error('❌ 載入後台角色資料失敗:', error);
      } finally {
        setRolesLoading(false);
      }
    };
    
    loadBackendRoles();
  }, [permissionService]);

  const reloadBackendRoles = async () => {
    try {
      console.log('🔄 重新載入後台角色資料...');
      setRolesLoading(true);
      const roles = await permissionService.getCurrentRoles();
      setBackendRoles(roles);
      permissionService.clearCache();
      console.log('✅ 後台角色資料重新載入完成');
    } catch (error) {
      console.error('❌ 重新載入後台角色資料失敗:', error);
    } finally {
      setRolesLoading(false);
    }
  };

  return {
    backendRoles,
    rolesLoading,
    reloadBackendRoles,
    permissionService
  };
};
