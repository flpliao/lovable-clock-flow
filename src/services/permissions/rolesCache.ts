
import { StaffRole } from '@/components/staff/types';
import { supabase } from '@/integrations/supabase/client';

export class RolesCacheManager {
  private rolesCache: StaffRole[] = [];
  private rolesCacheExpiry = 0;
  private readonly ROLES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async loadRolesFromBackend(): Promise<StaffRole[]> {
    try {
      // 檢查快取是否有效
      if (this.rolesCache.length > 0 && Date.now() < this.rolesCacheExpiry) {
        console.log('🎯 使用角色快取資料');
        return this.rolesCache;
      }
      
      console.log('🔄 從後台載入角色資料...');
      
      const { data, error } = await supabase
        .from('staff_roles')
        .select(`
          *,
          role_permissions!inner (
            permission_id,
            permissions!inner (
              id,
              name,
              code,
              description,
              category
            )
          )
        `)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('❌ 載入角色資料失敗:', error);
        return this.rolesCache;
      }
      
      // 轉換資料格式，包含權限
      const roles: StaffRole[] = (data || []).map(role => ({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: (role.role_permissions || []).map((rp: any) => ({
          id: rp.permissions.id,
          name: rp.permissions.name,
          code: rp.permissions.code,
          description: rp.permissions.description || '',
          category: rp.permissions.category || 'general'
        })),
        is_system_role: role.is_system_role || false
      }));
      
      // 更新快取
      this.rolesCache = roles;
      this.rolesCacheExpiry = Date.now() + this.ROLES_CACHE_DURATION;
      
      console.log('✅ 角色資料載入成功:', roles.length, '個角色');
      return roles;
      
    } catch (error) {
      console.error('❌ 載入角色資料系統錯誤:', error);
      return this.rolesCache;
    }
  }

  clearRolesCache(): void {
    console.log('🔄 清除角色快取');
    this.rolesCache = [];
    this.rolesCacheExpiry = 0;
  }
}
