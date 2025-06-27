import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  position: string;
  department: string;
  role: 'admin' | 'manager' | 'user';
}

export class AuthService {
  /**
   * 使用 Supabase Auth 進行登入驗證
   */
  static async authenticate(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string; session?: any }> {
    try {
      console.log('🔐 使用 Supabase Auth 登入:', email);
      
      // 如果沒有密碼，說明是從已有會話中獲取用戶資料
      if (!password) {
        return await this.getUserFromSession(email);
      }
      
      // 使用 Supabase Auth 登入
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.log('❌ Supabase Auth 登入失敗:', authError);
        return { 
          success: false, 
          error: authError.message || '登入失敗' 
        };
      }

      if (!authData.user || !authData.session) {
        console.log('❌ 登入成功但未獲取到用戶資料或會話');
        return { 
          success: false, 
          error: '登入失敗，請重試' 
        };
      }

      console.log('✅ Supabase Auth 登入成功');
      console.log('🎫 JWT Token:', authData.session.access_token);
      console.log('👤 用戶資料:', authData.user);

      const user = await this.buildUserFromAuth(authData.user, email);
      return { 
        success: true, 
        user,
        session: authData.session
      };
    } catch (error) {
      console.error('🔥 Supabase Auth 登入錯誤:', error);
      return { 
        success: false, 
        error: '系統錯誤，請稍後再試' 
      };
    }
  }

  /**
   * 從已有會話中獲取用戶資料
   */
  static async getUserFromSession(email: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      console.log('🔍 從會話中獲取用戶資料:', email);
      
      // 從 staff 表格獲取完整的用戶資料
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .single();

      if (staffError || !staffData) {
        console.log('⚠️ 無法載入員工資料，使用預設資料');
        // 獲取當前會話用戶
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          return { success: false, error: '無法獲取用戶資料' };
        }

        const user: AuthUser = {
          id: authUser.id,
          email: authUser.email || email,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '用戶',
          position: '員工',
          department: '一般',
          role: 'user'
        };

        return { success: true, user };
      }

      // 獲取當前會話用戶
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        return { success: false, error: '無法獲取用戶資料' };
      }

      const user = await this.buildUserFromStaff(authUser, staffData);
      return { success: true, user };
    } catch (error) {
      console.error('🔥 從會話獲取用戶資料錯誤:', error);
      return { success: false, error: '獲取用戶資料失敗' };
    }
  }

  /**
   * 從 Supabase Auth 用戶資料建構 AuthUser
   */
  static async buildUserFromAuth(authUser: User, email: string): Promise<AuthUser> {
    // 從 staff 表格獲取完整的用戶資料
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('email', email)
      .single();

    if (staffError || !staffData) {
      console.log('⚠️ 無法載入員工資料，使用預設資料');
      return {
        id: authUser.id,
        email: authUser.email || email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '用戶',
        position: '員工',
        department: '一般',
        role: 'user'
      };
    }

    return this.buildUserFromStaff(authUser, staffData);
  }

  /**
   * 從員工資料建構 AuthUser
   */
  static async buildUserFromStaff(authUser: User, staffData: any): Promise<AuthUser> {
    // 決定用戶權限等級
    let userRole: 'admin' | 'manager' | 'user' = 'user';
    
    // 廖俊雄永遠是最高管理員
    if (staffData.name === '廖俊雄' && staffData.id === '550e8400-e29b-41d4-a716-446655440001') {
      userRole = 'admin';
      console.log('🔐 廖俊雄最高管理員權限');
    } else if (staffData.role_id && staffData.role_id !== 'user') {
      // 基於 role_id 查詢後台角色權限
      try {
        const { data: roleInfo } = await supabase
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
          .eq('id', staffData.role_id)
          .single();

        if (roleInfo && roleInfo.role_permissions && roleInfo.role_permissions.length > 0) {
          const hasSystemManage = roleInfo.role_permissions?.some((rp: any) => 
            rp.permissions?.code === 'system:manage'
          );
          
          const hasStaffManage = roleInfo.role_permissions?.some((rp: any) => 
            rp.permissions?.code === 'staff:manage' || rp.permissions?.code === 'staff:edit'
          );
          
          if (hasSystemManage || roleInfo.is_system_role === true) {
            userRole = 'admin';
          } else if (hasStaffManage) {
            userRole = 'manager';
          }
        }
      } catch (error) {
        console.error('❌ 查詢角色權限失敗:', error);
      }
    }

    const user: AuthUser = {
      id: authUser.id, // 使用 Supabase Auth 的用戶 ID
      email: authUser.email || staffData.email,
      name: staffData.name,
      position: staffData.position,
      department: staffData.department,
      role: userRole
    };

    console.log('👤 最終用戶資料:', user);
    return user;
  }

  /**
   * 登出
   */
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🚪 登出中...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ 登出失敗:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ 登出成功');
      return { success: true };
    } catch (error) {
      console.error('🔥 登出錯誤:', error);
      return { success: false, error: '登出失敗' };
    }
  }

  /**
   * 獲取當前會話
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ 獲取會話失敗:', error);
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('🔥 獲取會話錯誤:', error);
      return null;
    }
  }

  /**
   * 獲取當前用戶
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ 獲取用戶失敗:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('🔥 獲取用戶錯誤:', error);
      return null;
    }
  }

  /**
   * 監聽認證狀態變化
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * 根據 email 查詢用戶資料（保持向後相容）
   */
  static async findUserByEmail(email: string): Promise<AuthUser | null> {
    // 這個方法現在主要用於向後相容
    // 實際的用戶驗證應該通過 authenticate 方法
    console.log('⚠️ findUserByEmail 方法已棄用，請使用 authenticate 方法');
    return null;
  }
}
