
import { useSupabaseRoleOperations } from './useSupabaseRoleOperations';
import { useSupabasePermissionUtils } from './useSupabasePermissionUtils';
import { supabase } from '@/integrations/supabase/client';
import { StaffRole, Permission } from '../types';

export const useSupabaseRoleManagement = () => {
  const {
    roles,
    loading,
    updateRole,
    addRole,
    deleteRole,
    loadAvailablePermissions,
    refreshRoles
  } = useSupabaseRoleOperations();

  const {
    getPermissionsByCategory,
    getPermissionCategories,
    hasPermission
  } = useSupabasePermissionUtils();

  // 取得角色
  const getRole = (roleId: string): StaffRole | undefined => {
    return roles.find(role => role.id === roleId);
  };

  // 分配角色給員工
  const assignRoleToStaff = async (staffId: string, roleId: string): Promise<boolean> => {
    try {
      console.log(`🔄 分配角色 ${roleId} 給員工 ${staffId}`);
      
      const { error } = await supabase
        .from('staff')
        .update({ role_id: roleId })
        .eq('id', staffId);

      if (error) throw error;

      console.log('✅ 角色分配成功');
      return true;
    } catch (error) {
      console.error('❌ 角色分配失敗:', error);
      return false;
    }
  };

  return {
    roles,
    loading,
    addRole,
    updateRole,
    deleteRole,
    getRole,
    hasPermission,
    assignRoleToStaff,
    loadAvailablePermissions,
    getPermissionsByCategory,
    getPermissionCategories,
    refreshRoles
  };
};
