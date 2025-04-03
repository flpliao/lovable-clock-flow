
import { Staff } from '../types';
import { useRolePersistence } from './useRolePersistence';
import { useRoleOperations } from './useRoleOperations';
import { usePermissionUtils } from './usePermissionUtils';

export const useRoleManagement = (staffList: Staff[]) => {
  const { roles, setRoles } = useRolePersistence();
  const { addRole, updateRole, deleteRole } = useRoleOperations(roles, setRoles, staffList);
  const { getRole, hasPermission: checkPermission, assignRoleToStaff } = usePermissionUtils(roles);
  
  // Wrapper for hasPermission that passes the staffList
  const hasPermission = (staffId: string, permissionCode: string): boolean => {
    return checkPermission(staffList, staffId, permissionCode);
  };
  
  return {
    roles,
    addRole,
    updateRole,
    deleteRole,
    getRole,
    hasPermission,
    assignRoleToStaff
  };
};
