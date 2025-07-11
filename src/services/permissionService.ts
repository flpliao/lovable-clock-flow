import { supabase } from '@/integrations/supabase/client';

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

class PermissionService {
  /**
   * 取得所有權限列表
   */
  async getPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`取得權限列表失敗: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('取得權限列表時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 更新角色的權限
   * @param roleId 角色 ID
   * @param permissionIds 權限 ID 列表
   */
  async updateRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    try {
      // 開始一個事務來處理權限更新
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

      if (deleteError) {
        throw new Error(`刪除現有權限失敗: ${deleteError.message}`);
      }

      // 如果有新的權限要添加
      if (permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permissionId => ({
          role_id: roleId,
          permission_id: permissionId,
        }));

        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (insertError) {
          throw new Error(`新增權限失敗: ${insertError.message}`);
        }
      }
    } catch (error) {
      console.error('更新角色權限時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 取得角色的所有權限
   * @param roleId 角色 ID
   */
  async getRolePermissions(roleId: string): Promise<Permission[]> {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(
          `
          permission_id,
          permissions (*)
        `
        )
        .eq('role_id', roleId);

      if (error) {
        throw new Error(`取得角色權限失敗: ${error.message}`);
      }

      return (data || []).map(item => item.permissions);
    } catch (error) {
      console.error('取得角色權限時發生錯誤:', error);
      throw error;
    }
  }
}

export const permissionService = new PermissionService();
