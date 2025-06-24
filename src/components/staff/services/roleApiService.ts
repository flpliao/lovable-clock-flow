
import { supabase } from '@/integrations/supabase/client';
import { StaffRole, NewStaffRole } from '../types';

export class RoleApiService {
  
  // 載入所有角色及其權限
  static async loadRoles(): Promise<StaffRole[]> {
    try {
      console.log('🔄 從後台載入角色資料...');
      
      const { data, error } = await supabase
        .from('staff_roles')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('❌ 載入角色資料失敗:', error);
        throw error;
      }
      
      // 轉換資料格式以符合前台介面，並載入權限資料
      const transformedRoles: StaffRole[] = await Promise.all(
        (data || []).map(async (role) => {
          const permissions = await this.loadRolePermissions(role.id);
          
          return {
            id: role.id,
            name: role.name,
            description: role.description || '',
            permissions: permissions,
            is_system_role: role.is_system_role || false
          };
        })
      );
      
      console.log('✅ 角色資料載入成功:', transformedRoles.length, '個角色');
      return transformedRoles;
      
    } catch (error) {
      console.error('❌ 載入角色資料系統錯誤:', error);
      throw error;
    }
  }
  
  // 載入角色權限
  static async loadRolePermissions(roleId: string) {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          permission_id,
          permissions (
            id,
            name,
            code,
            description,
            category
          )
        `)
        .eq('role_id', roleId);
      
      if (error) {
        console.error('❌ 載入角色權限失敗:', error);
        return [];
      }
      
      return (data || []).map(item => ({
        id: item.permissions.id,
        name: item.permissions.name,
        code: item.permissions.code,
        description: item.permissions.description,
        category: item.permissions.category
      }));
      
    } catch (error) {
      console.error('❌ 載入角色權限系統錯誤:', error);
      return [];
    }
  }
  
  // 新增角色
  static async createRole(newRole: NewStaffRole): Promise<StaffRole> {
    try {
      console.log('🔄 新增角色到後台:', newRole.name);
      
      const { data, error } = await supabase
        .from('staff_roles')
        .insert({
          id: `role_${Date.now()}`,
          name: newRole.name,
          description: newRole.description,
          is_system_role: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('❌ 新增角色失敗:', error);
        throw error;
      }
      
      // 儲存權限
      await this.saveRolePermissions(data.id, newRole.permissions);
      
      const createdRole: StaffRole = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: newRole.permissions,
        is_system_role: data.is_system_role
      };
      
      console.log('✅ 角色新增成功:', createdRole.name);
      return createdRole;
      
    } catch (error) {
      console.error('❌ 新增角色系統錯誤:', error);
      throw error;
    }
  }
  
  // 更新角色
  static async updateRole(role: StaffRole): Promise<StaffRole> {
    try {
      console.log('🔄 更新角色到後台:', role.name);
      
      const { data, error } = await supabase
        .from('staff_roles')
        .update({
          name: role.name,
          description: role.description,
          is_system_role: role.is_system_role
        })
        .eq('id', role.id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ 更新角色失敗:', error);
        throw error;
      }
      
      // 更新權限
      await this.saveRolePermissions(role.id, role.permissions);
      
      const updatedRole: StaffRole = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        permissions: role.permissions,
        is_system_role: data.is_system_role
      };
      
      console.log('✅ 角色更新成功:', updatedRole.name);
      return updatedRole;
      
    } catch (error) {
      console.error('❌ 更新角色系統錯誤:', error);
      throw error;
    }
  }
  
  // 儲存角色權限
  static async saveRolePermissions(roleId: string, permissions: any[]) {
    try {
      // 先刪除現有權限
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);
      
      // 插入新權限
      if (permissions.length > 0) {
        const permissionData = permissions.map(permission => ({
          role_id: roleId,
          permission_id: permission.id
        }));
        
        const { error } = await supabase
          .from('role_permissions')
          .insert(permissionData);
        
        if (error) {
          console.error('❌ 儲存角色權限失敗:', error);
          throw error;
        }
      }
      
      console.log('✅ 角色權限儲存成功:', permissions.length, '個權限');
      
    } catch (error) {
      console.error('❌ 儲存角色權限系統錯誤:', error);
      throw error;
    }
  }
  
  // 刪除角色
  static async deleteRole(roleId: string): Promise<void> {
    try {
      console.log('🔄 從後台刪除角色:', roleId);
      
      // 先刪除角色權限
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', roleId);
      
      // 再刪除角色
      const { error } = await supabase
        .from('staff_roles')
        .delete()
        .eq('id', roleId);
      
      if (error) {
        console.error('❌ 刪除角色失敗:', error);
        throw error;
      }
      
      console.log('✅ 角色刪除成功:', roleId);
      
    } catch (error) {
      console.error('❌ 刪除角色系統錯誤:', error);
      throw error;
    }
  }
  
  // 初始化系統預設角色
  static async initializeSystemRoles(): Promise<void> {
    try {
      console.log('🔄 初始化系統預設角色...');
      
      const systemRoles = [
        {
          id: 'admin',
          name: '系統管理員',
          description: '擁有系統完整管理權限',
          is_system_role: true
        },
        {
          id: 'manager',
          name: '部門主管',
          description: '部門管理權限',
          is_system_role: true
        },
        {
          id: 'user',
          name: '一般員工',
          description: '基本員工權限',
          is_system_role: true
        }
      ];
      
      for (const role of systemRoles) {
        const { error } = await supabase
          .from('staff_roles')
          .upsert(role, { onConflict: 'id' });
          
        if (error) {
          console.error('❌ 初始化系統角色失敗:', role.name, error);
        } else {
          console.log('✅ 系統角色初始化成功:', role.name);
        }
      }
      
    } catch (error) {
      console.error('❌ 初始化系統角色過程錯誤:', error);
    }
  }
}
