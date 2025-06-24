
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
      console.log('🔄 載入角色權限:', roleId);
      
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
      
      const permissions = (data || [])
        .filter(item => item.permissions) // 確保權限資料存在
        .map(item => ({
          id: item.permissions.id,
          name: item.permissions.name,
          code: item.permissions.code,
          description: item.permissions.description,
          category: item.permissions.category
        }));
      
      console.log('✅ 角色權限載入成功:', roleId, '共', permissions.length, '個權限');
      console.log('📋 權限詳細:', permissions.map(p => ({ id: p.id, name: p.name, category: p.category })));
      
      return permissions;
      
    } catch (error) {
      console.error('❌ 載入角色權限系統錯誤:', error);
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
        category: permission.category || 'general'
      }));
      
      console.log('✅ 權限資料載入成功:', permissions.length, '個權限');
      console.log('📊 權限分類統計:', permissions.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      
      return permissions;
      
    } catch (error) {
      console.error('❌ 載入權限資料系統錯誤:', error);
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
      console.log('🔄 更新角色到後台:', role.name, '權限數量:', role.permissions.length);
      console.log('📋 權限詳細資料:', role.permissions.map(p => ({ id: p.id, name: p.name })));
      
      // 先驗證權限ID是否存在
      const validPermissions = await this.validatePermissions(role.permissions);
      console.log('🔍 驗證權限結果:', validPermissions.length, '個有效權限');
      
      // 更新角色基本資料
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
        is_system_role: data.is_system_role
      };
      
      console.log('✅ 角色更新成功:', updatedRole.name, '權限數量:', updatedRole.permissions.length);
      return updatedRole;
      
    } catch (error) {
      console.error('❌ 更新角色系統錯誤:', error);
      throw error;
    }
  }
  
  // 驗證權限ID是否有效
  static async validatePermissions(permissions: any[]) {
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
      console.log('📋 有效權限詳細:', validPermissions.map(p => ({ id: p.id, name: p.name })));
      
      return validPermissions;
      
    } catch (error) {
      console.error('❌ 驗證權限系統錯誤:', error);
      return [];
    }
  }
  
  // 儲存角色權限
  static async saveRolePermissions(roleId: string, permissions: any[]) {
    try {
      console.log('🔄 儲存角色權限:', roleId, '權限數量:', permissions.length);
      console.log('📋 要儲存的權限ID:', permissions.map(p => p.id));
      
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
          permission_id: permission.id
        }));
        
        console.log('🔄 準備插入權限資料:', permissionData);
        
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(permissionData);
        
        if (insertError) {
          console.error('❌ 儲存角色權限失敗:', insertError);
          throw insertError;
        }
        
        console.log('✅ 新權限已儲存');
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
