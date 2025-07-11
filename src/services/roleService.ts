import { supabase } from '@/integrations/supabase/client';
import { NewStaffRole, Permission, StaffRole } from '../components/staff/types';

// 統一的職位型別定義
export interface Role {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  is_system_role?: boolean;
  permissions?: Permission[]; // 可選，用於進階權限管理
}

export interface NewRole {
  id: string;
  name: string;
  description?: string | null;
  is_system_role?: boolean;
  permissions?: Permission[]; // 可選，用於進階權限管理
}

const TABLE_NAME = 'staff_roles';

export class roleService {
  // === 基本 CRUD 操作 ===

  static async getRoles(): Promise<Role[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }

    return data || [];
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
  static async loadRoles(): Promise<StaffRole[]> {
    try {
      console.log('🔄 從後台載入職位資料...');

      const { data, error } = await supabase
        .from('staff_roles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ 載入職位資料失敗:', error);
        throw error;
      }

      // 轉換資料格式以符合前台介面，並載入權限資料
      const transformedRoles: StaffRole[] = await Promise.all(
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

      console.log('✅ 職位資料載入成功:', transformedRoles.length, '個職位');
      return transformedRoles;
    } catch (error) {
      console.error('❌ 載入職位資料系統錯誤:', error);
      throw error;
    }
  }

  // 載入職位權限
  static async loadRolePermissions(roleId: string) {
    try {
      console.log('🔄 載入職位權限:', roleId);

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
        console.error('❌ 載入職位權限失敗:', error);
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

      console.log('✅ 職位權限載入成功:', roleId, '共', permissions.length, '個權限');
      console.log(
        '📋 權限詳細:',
        permissions.map(p => ({ id: p.id, name: p.name, category: p.category }))
      );

      return permissions;
    } catch (error) {
      console.error('❌ 載入職位權限系統錯誤:', error);
      return [];
    }
  }

  // 載入所有可用權限
  static async loadAllPermissions() {
    try {
      console.log('🔄 載入所有可用權限...');

      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ 載入權限資料失敗:', error);
        return [];
      }

      const permissions = (data || []).map(permission => ({
        id: permission.id,
        name: permission.name,
        code: permission.code,
        description: permission.description || '',
        category: permission.category || 'general',
      }));

      console.log('✅ 權限資料載入成功:', permissions.length, '個權限');
      console.log(
        '📊 權限分類統計:',
        permissions.reduce(
          (acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      );

      return permissions;
    } catch (error) {
      console.error('❌ 載入權限資料系統錯誤:', error);
      return [];
    }
  }

  // 新增職位
  static async createRole(newRole: NewStaffRole): Promise<StaffRole> {
    try {
      console.log('🔄 新增職位到後台:', newRole.name);

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
        console.error('❌ 新增職位失敗:', error);
        throw error;
      }

      // 儲存權限
      await this.saveRolePermissions(data.id, newRole.permissions);

      const createdRole: StaffRole = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: newRole.permissions,
        is_system_role: data.is_system_role,
      };

      console.log('✅ 職位新增成功:', createdRole.name);
      return createdRole;
    } catch (error) {
      console.error('❌ 新增職位系統錯誤:', error);
      throw error;
    }
  }

  // 更新職位
  static async updateRoleWithPermissions(role: StaffRole): Promise<StaffRole> {
    try {
      console.log('🔄 更新職位到後台:', role.name, '權限數量:', role.permissions.length);
      console.log(
        '📋 權限詳細資料:',
        role.permissions.map(p => ({ id: p.id, name: p.name }))
      );

      // 先驗證權限ID是否存在
      const validPermissions = await this.validatePermissions(role.permissions);
      console.log('🔍 驗證權限結果:', validPermissions.length, '個有效權限');

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
        console.error('❌ 更新職位失敗:', error);
        throw error;
      }

      // 更新權限，使用驗證過的權限
      await this.saveRolePermissions(role.id, validPermissions);

      // 驗證權限是否正確儲存
      const savedPermissions = await this.loadRolePermissions(role.id);
      console.log('🔍 驗證儲存的權限:', savedPermissions.length, '個');

      const updatedRole: StaffRole = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: savedPermissions, // 使用實際儲存的權限
        is_system_role: data.is_system_role,
      };

      console.log(
        '✅ 職位更新成功:',
        updatedRole.name,
        '權限數量:',
        updatedRole.permissions.length
      );
      return updatedRole;
    } catch (error) {
      console.error('❌ 更新職位系統錯誤:', error);
      throw error;
    }
  }

  // 驗證權限ID是否有效
  static async validatePermissions(permissions: Permission[]) {
    try {
      console.log('🔍 驗證權限ID有效性...');

      if (!permissions || permissions.length === 0) {
        return [];
      }

      const permissionIds = permissions.map(p => p.id);
      console.log('📋 要驗證的權限ID:', permissionIds);

      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .in('id', permissionIds);

      if (error) {
        console.error('❌ 驗證權限失敗:', error);
        return [];
      }

      const validPermissions = data || [];
      console.log('✅ 有效權限:', validPermissions.length, '個');
      console.log(
        '📋 有效權限詳細:',
        validPermissions.map(p => ({ id: p.id, name: p.name }))
      );

      return validPermissions;
    } catch (error) {
      console.error('❌ 驗證權限系統錯誤:', error);
      return [];
    }
  }

  // 儲存職位權限
  static async saveRolePermissions(roleId: string, permissions: Permission[]) {
    try {
      console.log('🔄 儲存職位權限:', roleId, '權限數量:', permissions.length);
      console.log(
        '📋 要儲存的權限ID:',
        permissions.map(p => p.id)
      );

      // 先刪除現有權限
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);

      if (deleteError) {
        console.error('❌ 刪除舊權限失敗:', deleteError);
        throw deleteError;
      }

      console.log('✅ 舊權限已清除');

      // 插入新權限（只有當權限陣列不為空時）
      if (permissions.length > 0) {
        const permissionData = permissions.map(permission => ({
          role_id: roleId,
          permission_id: permission.id,
        }));

        console.log('🔄 準備插入權限資料:', permissionData);

        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permissionData);

        if (insertError) {
          console.error('❌ 儲存職位權限失敗:', insertError);
          throw insertError;
        }

        console.log('✅ 新權限已儲存');
      }

      console.log('✅ 職位權限儲存成功:', permissions.length, '個權限');
    } catch (error) {
      console.error('❌ 儲存職位權限系統錯誤:', error);
      throw error;
    }
  }

  // 刪除職位（進階版本，包含權限清理）
  static async deleteRole(roleId: string): Promise<void> {
    try {
      console.log('🔄 從後台刪除職位:', roleId);

      // 先刪除職位權限
      await supabase.from('role_permissions').delete().eq('role_id', roleId);

      // 再刪除職位
      const { error } = await supabase.from('staff_roles').delete().eq('id', roleId);

      if (error) {
        console.error('❌ 刪除職位失敗:', error);
        throw error;
      }

      console.log('✅ 職位刪除成功:', roleId);
    } catch (error) {
      console.error('❌ 刪除職位系統錯誤:', error);
      throw error;
    }
  }
}
