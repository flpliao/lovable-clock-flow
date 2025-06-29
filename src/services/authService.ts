
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
        
        // 根據錯誤類型返回友好的錯誤訊息
        let friendlyError = '登入失敗';
        if (authError.message.includes('Invalid login credentials')) {
          friendlyError = '帳號或密碼不正確';
        } else if (authError.message.includes('Email not confirmed')) {
          friendlyError = '請先確認您的電子郵件';
        } else if (authError.message.includes('Too many requests')) {
          friendlyError = '嘗試次數過多，請稍後再試';
        }
        
        return { 
          success: false, 
          error: friendlyError
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
      console.log('👤 用戶資料:', authData.user.email);

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
      
      // 從 staff 表格獲取完整的用戶資料，使用 maybeSingle 避免錯誤
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('數據庫查詢超時')), 8000)
      );
      
      const staffQueryPromise = supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .maybeSingle(); // 修正：使用 maybeSingle 避免多筆或查無資料導致中斷

      const { data: staffData, error: staffError } = await Promise.race([staffQueryPromise, timeoutPromise]) as any;

      if (staffError) {
        console.warn('⚠️ 查詢員工資料時發生錯誤:', staffError.message);
        // 獲取當前會話用戶作為 fallback
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          return { success: false, error: '無法獲取用戶資料' };
        }

        return { success: true, user: this.createFallbackUser(authUser, email) };
      }

      // 獲取當前會話用戶
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        return { success: false, error: '無法獲取用戶資料' };
      }

      if (staffData) {
        console.log('✅ 成功載入員工資料:', {
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          department: staffData.department
        });
        
        const user = await this.buildUserFromStaff(authUser, staffData);
        return { success: true, user };
      } else {
        console.warn('⚠️ 未找到對應的員工資料，使用 fallback 並嘗試自動建立');
        const fallbackUser = this.createFallbackUser(authUser, email);
        
        // 嘗試自動建立 staff 紀錄
        await this.createStaffRecord(authUser, email);
        
        return { success: true, user: fallbackUser };
      }
    } catch (error) {
      console.error('🔥 從會話獲取用戶資料錯誤:', error);
      
      // 提供最後的 fallback
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          return { success: true, user: this.createFallbackUser(authUser, email) };
        }
      } catch (fallbackError) {
        console.error('🔥 Fallback 也失敗:', fallbackError);
      }
      
      return { success: false, error: '獲取用戶資料失敗' };
    }
  }

  /**
   * 從 Supabase Auth 用戶資料建構 AuthUser
   */
  static async buildUserFromAuth(authUser: User, email: string): Promise<AuthUser> {
    try {
      // 從 staff 表格獲取完整的用戶資料，使用 maybeSingle
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (staffError) {
        console.warn('⚠️ 查詢員工資料時發生錯誤:', staffError.message);
        return this.createFallbackUser(authUser, email);
      }

      if (staffData) {
        console.log('✅ 從 Auth 流程載入員工資料:', {
          name: staffData.name,
          role: staffData.role,
          department: staffData.department
        });
        return this.buildUserFromStaff(authUser, staffData);
      } else {
        console.warn('⚠️ Auth 流程中未找到員工資料，使用 fallback');
        // 嘗試自動建立 staff 紀錄
        await this.createStaffRecord(authUser, email);
        return this.createFallbackUser(authUser, email);
      }
    } catch (error) {
      console.error('🔥 buildUserFromAuth 錯誤:', error);
      return this.createFallbackUser(authUser, email);
    }
  }

  /**
   * 從員工資料建構 AuthUser
   */
  static async buildUserFromStaff(authUser: User, staffData: any): Promise<AuthUser> {
    // 優先從 staff.role 判斷使用者權限
    let userRole: 'admin' | 'manager' | 'user' = 'user';
    
    // 廖俊雄永遠是最高管理員（超級管理員檢查）
    if (staffData.name === '廖俊雄' || staffData.email === 'flpliao@gmail.com' || authUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      userRole = 'admin';
      console.log('🔐 廖俊雄超級管理員權限確認');
    } else if (staffData.role === 'admin') {
      userRole = 'admin';
      console.log('🔐 管理員權限確認:', staffData.name);
    } else if (staffData.role === 'manager') {
      userRole = 'manager';
      console.log('🔐 主管權限確認:', staffData.name);
    } else {
      console.log('🔐 一般使用者權限:', staffData.name, '角色:', staffData.role);
    }

    const user: AuthUser = {
      id: authUser.id, // 使用 Supabase Auth 的用戶 ID
      email: authUser.email || staffData.email,
      name: staffData.name,
      position: staffData.position,
      department: staffData.department,
      role: userRole
    };

    console.log('👤 最終用戶資料:', {
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    });
    
    return user;
  }

  /**
   * 創建 fallback 用戶資料
   */
  static createFallbackUser(authUser: User, email: string): AuthUser {
    const fallbackUser: AuthUser = {
      id: authUser.id,
      email: authUser.email || email,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '用戶',
      position: '員工',
      department: '一般',
      role: 'user'
    };

    console.log('⚠️ 使用 fallback 用戶資料:', fallbackUser);
    return fallbackUser;
  }

  /**
   * 自動建立 staff 紀錄
   */
  static async createStaffRecord(authUser: User, email: string): Promise<void> {
    try {
      console.log('➕ 嘗試自動建立 staff 紀錄:', email);
      
      const newStaffData = {
        user_id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || '新用戶',
        department: '待分配',
        position: '員工',
        email: email,
        contact: email,
        role: 'user',
        role_id: 'user',
        branch_id: null,
        branch_name: '總公司'
      };

      const { error: insertError } = await supabase
        .from('staff')
        .insert([newStaffData]);

      if (insertError) {
        console.warn('⚠️ 自動建立 staff 紀錄失敗:', insertError.message);
      } else {
        console.log('✅ 成功自動建立 staff 紀錄');
      }
    } catch (error) {
      console.warn('⚠️ 自動建立 staff 紀錄時發生錯誤:', error);
    }
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
}
