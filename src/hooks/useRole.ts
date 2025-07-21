import { NewRole, Role, roleService } from '@/services/roleService';
import { useRoleStore } from '@/stores/roleStore';

export const loadRoles = async () => {
  const { roles, setRoles } = useRoleStore.getState();
  if (roles.length > 0) return;
  const data = await roleService.getRoles();
  setRoles(data);
};

export const addRole = async (roleData: NewRole) => {
  const { roles, setRoles } = useRoleStore.getState();
  const newRole = await roleService.addRole(roleData);
  setRoles([...roles, newRole]);
  return newRole;
};

export const updateRole = async (roleData: Role) => {
  const { roles, setRoles } = useRoleStore.getState();
  const updatedRole = await roleService.updateRole(roleData);
  setRoles(roles.map(r => (r.id === updatedRole.id ? updatedRole : r)));
  return updatedRole;
};

export const deleteRole = async (id: string) => {
  const { removeRole } = useRoleStore.getState();
  await roleService.deleteRole(id);
  removeRole(id);
};
