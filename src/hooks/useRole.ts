import { roleService } from '@/services/roleService';
import { useRoleStore } from '@/stores/roleStore';
import { NewRole, Role } from '@/types/role';
import { useState } from 'react';

export const useRole = () => {
  const [loading, setLoading] = useState(false);
  const { roles: data, setRoles, removeRole: removeFromStore } = useRoleStore();

  const loadRoles = async () => {
    if (data.length > 0) return;

    setLoading(true);
    try {
      const roles = await roleService.getRoles();
      setRoles(roles);
    } catch (error) {
      console.error('載入職位失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRole = async (roleData: NewRole) => {
    try {
      const newRole = await roleService.addRole(roleData);
      setRoles([...data, newRole]);
      return newRole;
    } catch (error) {
      console.error('新增職位失敗:', error);
      throw error;
    }
  };

  const updateRole = async (roleData: Role) => {
    try {
      const updatedRole = await roleService.updateRole(roleData);
      setRoles(data.map(r => (r.id === updatedRole.id ? updatedRole : r)));
      return updatedRole;
    } catch (error) {
      console.error('更新職位失敗:', error);
      throw error;
    }
  };

  const deleteRole = async (id: string) => {
    try {
      await roleService.deleteRole(id);
      removeFromStore(id);
    } catch (error) {
      console.error('刪除職位失敗:', error);
      throw error;
    }
  };

  return {
    data,
    loading,
    loadRoles,
    refresh: loadRoles,
    addRole,
    updateRole,
    deleteRole,
  };
};
