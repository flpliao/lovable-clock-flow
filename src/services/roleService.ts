import { supabase } from '@/integrations/supabase/client';
import { NewRole, Permission, Role } from '@/types/role';

const TABLE_NAME = 'staff_roles';

export class roleService {
  // === 基本 CRUD 操作 ===

  static async getRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
      *,
      role_permissions:role_permissions (
        permission_id,
        permissions (
          id,
          name,
          code,
          description,
          category
        )
      )
    `
      )
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }

    // 將 role_permissions 轉成 permissions: Permission[]
    const roles: Role[] = (data || []).map(role => {
      const permissions: Permission[] = (role.role_permissions || [])
        .filter(rp => rp.permissions)
        .map(rp => ({
          id: rp.permissions.id,
          name: rp.permissions.name,
          code: rp.permissions.code,
          description: rp.permissions.description,
          category: rp.permissions.category,
        }));
      return {
        id: role.id,
        name: role.name,
        description: role.description || '',
        is_system_role: role.is_system_role || false,
        permissions,
      };
    });

    return roles;
  }

  static async addRole(newRole: NewRole): Promise<Role> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([
        {
          id: newRole.id,
          name: newRole.name,
          description: newRole.description,
          is_system_role: newRole.is_system_role || false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding role:', error);
      throw error;
    }

    return data;
  }

  static async updateRole(role: Role): Promise<Role> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update({
        name: role.name,
        description: role.description,
        is_system_role: role.is_system_role,
      })
      .eq('id', role.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating role:', error);
      throw error;
    }

    return data;
  }

  // === 進階職位管理功能（包含權限系統） ===

  // 載入所有職位及其權限
  static async loadRoles(): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('staff_roles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      // 轉換資料格式以符合前台介面，並載入權限資料
      const transformedRoles: Role[] = await Promise.all(
        (data || []).map(async role => {
          const permissions = await this.loadRolePermissions(role.id);

          return {
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions: permissions,
            is_system_role: role.is_system_role || false,
          };
        })
      );

      return transformedRoles;
    } catch (error) {
      console.error('❌ 載入職位資料系統錯誤:', error);
      throw error;
    }
  }

  // 載入職位權限
  static async loadRolePermissions(roleId: string) {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(
          `
          permission_id,
          permissions (
            id,
            name,
            code,
            description,
            category
          )
        `
        )
        .eq('role_id', roleId);

      if (error) {
        return [];
      }

      const permissions = (data || [])
        .filter(item => item.permissions) // 確保權限資料存在
        .map(item => ({
          id: item.permissions.id,
          name: item.permissions.name,
          code: item.permissions.code,
          description: item.permissions.description,
          category: item.permissions.category,
        }));

      return permissions;
    } catch (error) {
      console.error('❌ 載入職位權限系統錯誤:', error);
      return [];
    }
  }

  // 載入所有可用權限
  static async loadAllPermissions() {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        return [];
      }

      const permissions = (data || []).map(permission => ({
        id: permission.id,
        name: permission.name,
        code: permission.code,
        description: permission.description || '',
        category: permission.category || 'general',
      }));

      return permissions;
    } catch (error) {
      console.error('❌ 載入權限資料系統錯誤:', error);
      return [];
    }
  }

  // 新增職位
  static async createRole(newRole: NewRole): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('staff_roles')
        .insert({
          id: `role_${Date.now()}`,
          name: newRole.name,
          description: newRole.description,
          is_system_role: false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 儲存權限
      await this.saveRolePermissions(data.id, newRole.permissions);

      const createdRole: Role = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: newRole.permissions,
        is_system_role: data.is_system_role,
      };

      return createdRole;
    } catch (error) {
      console.error('❌ 新增職位系統錯誤:', error);
      throw error;
    }
  }

  // 更新職位
  static async updateRoleWithPermissions(role: Role): Promise<Role> {
    try {
      // 先驗證權限ID是否存在
      const validPermissions = await this.validatePermissions(role.permissions);

      // 更新職位基本資料
      const { data, error } = await supabase
        .from('staff_roles')
        .update({
          name: role.name,
          description: role.description,
          is_system_role: role.is_system_role,
        })
        .eq('id', role.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // 更新權限，使用驗證過的權限
      await this.saveRolePermissions(role.id, validPermissions);

      // 驗證權限是否正確儲存
      const savedPermissions = await this.loadRolePermissions(role.id);

      const updatedRole: Role = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: savedPermissions, // 使用實際儲存的權限
        is_system_role: data.is_system_role,
      };

      return updatedRole;
    } catch (error) {
      console.error('❌ 更新職位系統錯誤:', error);
      throw error;
    }
  }

  // 驗證權限ID是否有效
  static async validatePermissions(permissions: Permission[]) {
    try {
      if (!permissions || permissions.length === 0) {
        return [];
      }

      const permissionIds = permissions.map(p => p.id);

      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .in('id', permissionIds);

      if (error) {
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('❌ 驗證權限系統錯誤:', error);
      return [];
    }
  }

  // 儲存職位權限
  static async saveRolePermissions(roleId: string, permissions: Permission[]) {
    try {
      // 先刪除現有權限
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

      if (deleteError) {
        throw deleteError;
      }

      // 插入新權限（只有當權限陣列不為空時）
      if (permissions.length > 0) {
        const permissionData = permissions.map(permission => ({
          role_id: roleId,
          permission_id: permission.id,
        }));

        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permissionData);

        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error('❌ 儲存職位權限系統錯誤:', error);
      throw error;
    }
  }

  // 刪除職位（進階版本，包含權限清理）
  static async deleteRole(roleId: string): Promise<void> {
    try {
      // 先刪除職位權限
      await supabase.from('role_permissions').delete().eq('role_id', roleId);

      // 再刪除職位
      const { error } = await supabase.from('staff_roles').delete().eq('id', roleId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('❌ 刪除職位系統錯誤:', error);
      throw error;
    }
  }
}
