import { supabase } from '@/integrations/supabase/client';
import { usePermissionStore } from '@/stores/permissionStore';

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
  private CACHE_DURATION = 5 * 60 * 1000; // 5分鐘快取

  /**
   * 載入所有權限資料（包含快取處理）
   */
  async loadAllPermissions(): Promise<Permission[]> {
    const store = usePermissionStore.getState();

    // 檢查快取是否有效
    if (store.lastUpdate && Date.now() - store.lastUpdate < this.CACHE_DURATION) {
      console.log('📦 PermissionService: 使用快取的權限資料');
      return store.permissions;
    }

    console.log('🔄 PermissionService: 開始載入所有權限資料');
    const permissions = await this.getPermissions();
    store.setPermissions(permissions);
    return permissions;
  }

  /**
   * 強制重新載入權限資料
   */
  async refreshPermissions(): Promise<Permission[]> {
    const store = usePermissionStore.getState();
    store.clearPermissions();
    return this.loadAllPermissions();
  }

  /**
   * 取得所有權限列表（原有功能）
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
   * 更新角色的權限（原有功能）
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
   * 取得角色的所有權限（原有功能）
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
