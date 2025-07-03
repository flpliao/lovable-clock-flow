import { roleService } from '@/services/roleService';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { useEffect, useState } from 'react';
import { StaffRole } from '../types';

export const useSupabaseRolePersistence = () => {
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(false);
  const permissionService = UnifiedPermissionService.getInstance();

  // 載入角色資料
  const loadRoles = async () => {
    try {
      setLoading(true);
      console.log('🔄 正在從後台同步角色資料...');

      // 初始化系統預設角色
      await roleService.initializeSystemRoles();

      // 載入所有角色及其權限
      const loadedRoles = await roleService.loadRoles();
      console.log(
        '📊 載入的角色資料:',
        loadedRoles.map(r => ({
          name: r.name,
          permissionCount: r.permissions.length,
          isSystem: r.is_system_role,
        }))
      );

      setRoles(loadedRoles);

      // 清除權限快取，確保使用最新角色資料
      permissionService.clearCache();

      console.log('✅ 角色資料同步完成，共載入', loadedRoles.length, '個角色');
    } catch (error) {
      console.error('❌ 角色資料同步失敗:', error);
      // 發生錯誤時，保持現有角色資料不變
    } finally {
      setLoading(false);
    }
  };

  // 新增角色
  const addRole = async (newRole: Omit<StaffRole, 'id'>): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 新增角色:', newRole.name, '權限數量:', newRole.permissions.length);
      console.log(
        '📋 新增角色權限詳細:',
        newRole.permissions.map(p => ({ id: p.id, name: p.name }))
      );

      // 驗證權限資料
      if (!newRole.name || newRole.name.trim() === '') {
        console.error('❌ 角色名稱不能為空');
        return false;
      }

      // 確保權限資料格式正確
      const validatedPermissions = newRole.permissions.filter(
        permission => permission && permission.id && permission.name
      );

      console.log('🔍 有效權限數量:', validatedPermissions.length);

      const roleToAdd = {
        ...newRole,
        permissions: validatedPermissions,
      };

      const createdRole = await roleService.createRole(roleToAdd);

      // 更新本地狀態
      setRoles(prev => [...prev, createdRole]);

      // 觸發權限同步
      permissionService.clearCache();
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('permissionUpdated', {
            detail: { operation: 'addRole', roleData: createdRole },
          })
        );
      }, 100);

      console.log(
        '✅ 角色新增成功:',
        createdRole.name,
        '權限數量:',
        createdRole.permissions.length
      );
      return true;
    } catch (error) {
      console.error('❌ 角色新增失敗:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 更新角色
  const updateRole = async (updatedRole: StaffRole): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔄 更新角色:', updatedRole.name, '權限數量:', updatedRole.permissions.length);

      const savedRole = await roleService.updateRole(updatedRole);

      // 更新本地狀態
      setRoles(prev => prev.map(role => (role.id === savedRole.id ? savedRole : role)));

      // 觸發權限同步
      permissionService.clearCache();
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('permissionUpdated', {
            detail: { operation: 'updateRole', roleData: savedRole },
          })
        );
      }, 100);

      console.log('✅ 角色更新成功:', savedRole.name, '權限數量:', savedRole.permissions.length);
      return true;
    } catch (error) {
      console.error('❌ 角色更新失敗:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 刪除角色
  const deleteRole = async (roleId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const roleToDelete = roles.find(role => role.id === roleId);
      console.log('🔄 刪除角色:', roleToDelete?.name);

      await roleService.deleteRole(roleId);

      // 更新本地狀態
      setRoles(prev => prev.filter(role => role.id !== roleId));

      // 觸發權限同步
      permissionService.clearCache();
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('permissionUpdated', {
            detail: { operation: 'deleteRole', roleData: { id: roleId, name: roleToDelete?.name } },
          })
        );
      }, 100);

      console.log('✅ 角色刪除成功:', roleToDelete?.name);
      return true;
    } catch (error) {
      console.error('❌ 角色刪除失敗:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 初始化載入
  useEffect(() => {
    console.log('🚀 初始化角色管理系統，連動後台資料...');
    loadRoles();
  }, []);

  // 監聽權限更新事件
  useEffect(() => {
    const handlePermissionUpdate = () => {
      console.log('🔔 收到權限更新事件，重新載入角色資料');
      loadRoles();
    };

    window.addEventListener('permissionForceReload', handlePermissionUpdate);

    return () => {
      window.removeEventListener('permissionForceReload', handlePermissionUpdate);
    };
  }, []);

  return {
    roles,
    setRoles,
    loading,
    addRole,
    updateRole,
    deleteRole,
    loadRoles,
  };
};
