
import { Staff } from '../types';
import { useSupabaseRolePersistence } from './useSupabaseRolePersistence';
import { useRoleOperations } from './useRoleOperations';
import { usePermissionUtils } from './usePermissionUtils';

export const useRoleManagement = (staffList: Staff[]) => {
  const { 
    roles, 
    setRoles, 
    loading,
    addRole: createRole,
    updateRole: saveRole,
    deleteRole: removeRole,
    loadRoles
  } = useSupabaseRolePersistence();
  
  const { addRole, updateRole, deleteRole } = useRoleOperations(roles, setRoles, staffList);
  const { getRole, hasPermission: checkPermission, assignRoleToStaff } = usePermissionUtils(roles);
  
  // 使用 Supabase 連動的角色操作
  const handleAddRole = async (newRole: Omit<any, 'id'>): Promise<boolean> => {
    console.log('📝 使用後台連動新增角色:', newRole.name);
    return await createRole(newRole);
  };
  
  const handleUpdateRole = async (updatedRole: any): Promise<boolean> => {
    console.log('📝 使用後台連動更新角色:', updatedRole.name);
    return await saveRole(updatedRole);
  };
  
  const handleDeleteRole = async (roleId: string): Promise<boolean> => {
    console.log('📝 使用後台連動刪除角色:', roleId);
    return await removeRole(roleId);
  };
  
  // Wrapper for hasPermission that passes the staffList
  const hasPermission = (staffId: string, permissionCode: string): boolean => {
    return checkPermission(staffList, staffId, permissionCode);
  };
  
  return {
    roles,
    loading,
    addRole: handleAddRole,
    updateRole: handleUpdateRole,
    deleteRole: handleDeleteRole,
    getRole,
    hasPermission,
    assignRoleToStaff,
    refreshRoles: loadRoles
  };
};
