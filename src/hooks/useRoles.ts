import { createRole, getAllRoles, updateRole } from '@/services/roleService';
import { useRoleStore } from '@/stores/roleStore';
import { NewRole, Role } from '@/types/role';
import { showError } from '@/utils/toast';

export const useRoles = () => {
  const { roles, setRoles, loading, setLoading } = useRoleStore();

  const loadRoles = async () => {
    if (roles.length > 0 || loading) return;

    setLoading(true);
    try {
      const roles = await getAllRoles();
      setRoles(roles);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData: Omit<NewRole, 'id'>) => {
    try {
      const newRole = await createRole(roleData);
      setRoles([...roles, newRole]);
      return newRole;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  const handleUpdateRole = async (slug: string, roleData: Partial<Omit<Role, 'id'>>) => {
    try {
      const updatedRole = await updateRole(slug, roleData);
      setRoles(roles.map(r => (r.id === updatedRole.id ? updatedRole : r)));
      return updatedRole;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  return {
    roles,
    loading,
    loadRoles,
    handleCreateRole,
    handleUpdateRole,
  };
};
