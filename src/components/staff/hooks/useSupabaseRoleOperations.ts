
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { StaffRole, Permission } from '../types';

export const useSupabaseRoleOperations = () => {
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 載入角色和權限資料
  const loadRoles = async () => {
    try {
      console.log('🔄 從 Supabase 載入角色資料...');
      setLoading(true);

      // 載入角色資料
      const { data: rolesData, error: rolesError } = await supabase
        .from('staff_roles')
        .select('*')
        .order('name');

      if (rolesError) throw rolesError;

      // 載入權限資料
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('permissions')
        .select('*')
        .order('category, name');

      if (permissionsError) throw permissionsError;

      // 載入角色權限關聯
      const { data: rolePermissionsData, error: rolePermissionsError } = await supabase
        .from('role_permissions')
        .select('*');

      if (rolePermissionsError) throw rolePermissionsError;

      // 組合資料
      const transformedRoles: StaffRole[] = rolesData.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        is_system_role: role.is_system_role,
        permissions: permissionsData
          .filter(permission => 
            rolePermissionsData.some(rp => 
              rp.role_id === role.id && rp.permission_id === permission.id
            )
          )
          .map(permission => ({
            id: permission.id,
            name: permission.name,
            code: permission.code,
            description: permission.description || '',
            category: permission.category
          }))
      }));

      console.log('✅ 成功載入角色資料:', transformedRoles);
      setRoles(transformedRoles);
    } catch (error) {
      console.error('❌ 載入角色資料失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入角色資料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 更新角色權限
  const updateRole = async (updatedRole: StaffRole): Promise<boolean> => {
    try {
      console.log('🔄 更新角色權限:', updatedRole.name);

      // 更新角色基本資訊
      const { error: updateError } = await supabase
        .from('staff_roles')
        .update({
          name: updatedRole.name,
          description: updatedRole.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedRole.id);

      if (updateError) throw updateError;

      // 刪除現有的角色權限關聯
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', updatedRole.id);

      if (deleteError) throw deleteError;

      // 插入新的角色權限關聯
      if (updatedRole.permissions.length > 0) {
        const rolePermissions = updatedRole.permissions.map(permission => ({
          role_id: updatedRole.id,
          permission_id: permission.id
        }));

        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (insertError) throw insertError;
      }

      toast({
        title: "更新成功",
        description: `已成功更新 ${updatedRole.name} 角色權限`
      });

      // 重新載入資料
      await loadRoles();
      return true;
    } catch (error) {
      console.error('❌ 更新角色權限失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新角色權限",
        variant: "destructive"
      });
      return false;
    }
  };

  // 新增角色
  const addRole = async (newRole: Omit<StaffRole, 'id'>): Promise<boolean> => {
    try {
      console.log('🔄 新增角色:', newRole.name);

      // 生成角色 ID
      const roleId = `role_${Date.now()}`;

      // 插入角色
      const { error: insertError } = await supabase
        .from('staff_roles')
        .insert({
          id: roleId,
          name: newRole.name,
          description: newRole.description,
          is_system_role: false
        });

      if (insertError) throw insertError;

      // 插入角色權限關聯
      if (newRole.permissions.length > 0) {
        const rolePermissions = newRole.permissions.map(permission => ({
          role_id: roleId,
          permission_id: permission.id
        }));

        const { error: permissionError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);

        if (permissionError) throw permissionError;
      }

      toast({
        title: "新增成功",
        description: `已成功新增 ${newRole.name} 角色`
      });

      // 重新載入資料
      await loadRoles();
      return true;
    } catch (error) {
      console.error('❌ 新增角色失敗:', error);
      toast({
        title: "新增失敗",
        description: "無法新增角色",
        variant: "destructive"
      });
      return false;
    }
  };

  // 刪除角色
  const deleteRole = async (roleId: string): Promise<boolean> => {
    try {
      const role = roles.find(r => r.id === roleId);
      if (!role) return false;

      if (role.is_system_role) {
        toast({
          title: "無法刪除",
          description: "系統預設角色無法刪除",
          variant: "destructive"
        });
        return false;
      }

      console.log('🔄 刪除角色:', role.name);

      // 刪除角色（CASCADE 會自動刪除相關的權限關聯）
      const { error } = await supabase
        .from('staff_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: "刪除成功",
        description: `已成功刪除 ${role.name} 角色`
      });

      // 重新載入資料
      await loadRoles();
      return true;
    } catch (error) {
      console.error('❌ 刪除角色失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除角色",
        variant: "destructive"
      });
      return false;
    }
  };

  // 載入所有可用權限
  const loadAvailablePermissions = async (): Promise<Permission[]> => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category, name');

      if (error) throw error;

      return data.map(permission => ({
        id: permission.id,
        name: permission.name,
        code: permission.code,
        description: permission.description || '',
        category: permission.category
      }));
    } catch (error) {
      console.error('❌ 載入權限資料失敗:', error);
      return [];
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  return {
    roles,
    loading,
    updateRole,
    addRole,
    deleteRole,
    loadAvailablePermissions,
    refreshRoles: loadRoles
  };
};
