
import { Permission } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const useSupabasePermissionUtils = () => {
  // 根據分類取得權限
  const getPermissionsByCategory = async (): Promise<Record<string, Permission[]>> => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('category, name');

      if (error) throw error;

      const groupedPermissions: Record<string, Permission[]> = {};
      
      data.forEach(permission => {
        if (!groupedPermissions[permission.category]) {
          groupedPermissions[permission.category] = [];
        }
        groupedPermissions[permission.category].push({
          id: permission.id,
          name: permission.name,
          code: permission.code,
          description: permission.description || '',
          category: permission.category
        });
      });

      return groupedPermissions;
    } catch (error) {
      console.error('❌ 載入權限分類失敗:', error);
      return {};
    }
  };

  // 取得所有權限分類
  const getPermissionCategories = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('category')
        .order('category');

      if (error) throw error;

      const categories = new Set<string>();
      data.forEach(item => categories.add(item.category));
      return Array.from(categories);
    } catch (error) {
      console.error('❌ 載入權限分類失敗:', error);
      return [];
    }
  };

  // 檢查員工是否有特定權限
  const hasPermission = async (staffId: string, permissionCode: string): Promise<boolean> => {
    try {
      // 先取得員工的角色
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role, role_id')
        .eq('id', staffId)
        .single();

      if (staffError || !staffData) return false;

      // 系統管理員擁有所有權限
      if (staffData.role === 'admin') return true;

      // 檢查角色權限
      const { data: rolePermissions, error: permissionError } = await supabase
        .from('role_permissions')
        .select('permission_id, permissions!inner(code)')
        .eq('role_id', staffData.role_id);

      if (permissionError) return false;

      return rolePermissions.some((rp: any) => 
        rp.permissions.code === permissionCode
      );
    } catch (error) {
      console.error('❌ 檢查權限失敗:', error);
      return false;
    }
  };

  return {
    getPermissionsByCategory,
    getPermissionCategories,
    hasPermission
  };
};
