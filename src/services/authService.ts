import { supabase } from '@/integrations/supabase/client';
import { User as AuthUser } from '@/types/index';

// 從 supabase client 獲取 User 類型，而不是直接從 @supabase/supabase-js 導入
type SupabaseUser = NonNullable<Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user']>;

// Export the AuthUser type for use in other files
export type { AuthUser };

export class AuthService {
  /**
   * 使用 Supabase Auth 進行登入驗證
   */
  static async authenticate(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string; session?: unknown }> {
    try {
      console.log('🔐 使用 Supabase Auth 登入:', email);
      
      if (!password) {
        return { success: false, error: '密碼不能為空' };
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
      console.log('👤 Auth 用戶資料:', {
        id: authData.user.id,
        email: authData.user.email
      });

      const user = await this.buildUserFromSession(authData.user, email);
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
   * 🚨 新方法：直接從 session 建構用戶資料，避免額外 API 調用
   */
  static async buildUserFromSession(authUser: SupabaseUser, email: string): Promise<AuthUser> {
    try {
      console.log('🔍 從 session 建構用戶資料:', email);
      
      const staffData = await this.findStaffRecord(authUser);
      
      if (staffData) {
        console.log('✅ 成功匹配 staff 資料:', {
          staff_id: staffData.id,
          auth_user_id: authUser.id,
          staff_user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role_id: staffData.role_id,
          department: staffData.department
        });
        
        if (staffData.user_id !== authUser.id) {
          console.log('🔄 更新 staff 記錄的 user_id 以建立正確關聯');
          await this.updateStaffUserIdMapping(staffData.id as string, authUser.id);
        }
        
        const user = this.buildUserFromStaff(authUser, staffData);
        return user;
      } else {
        console.warn('⚠️ 未找到對應的員工資料，使用 fallback');
        const fallbackUser = this.createFallbackUser(authUser, email);
        
        await this.createStaffRecord(authUser, email);
        
        return fallbackUser;
      }
    } catch (error) {
      console.error('🔥 從 session 建構用戶資料錯誤:', error);
      return this.createFallbackUser(authUser, email);
    }
  }

  /**
   * 從已有會話中獲取用戶資料 - 保留此方法以支援舊代碼
   * 🚨 注意：此方法已棄用，建議使用 buildUserFromSession
   */
  static async getUserFromSession(email: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      console.log('⚠️ [已棄用] 從會話中獲取用戶資料:', email);
      
      return { success: false, error: '此方法已棄用，請使用 authStore 的新流程' };
    } catch (error) {
      console.error('🔥 從會話獲取用戶資料錯誤:', error);
      return { success: false, error: '獲取用戶資料失敗' };
    }
  }

  /**
   * 多重策略查找 staff 記錄，重點改善 ID 匹配邏輯
   */
  static async findStaffRecord(authUser: SupabaseUser): Promise<Record<string, unknown> | null> {
      
    try {
      // 策略1: 透過 user_id 精確匹配
      console.log('📋 策略1: 透過 user_id 查詢');
      let { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (!error && staffData) {
        console.log('✅ 策略1 成功: 透過 user_id 找到 staff 記錄');
        return staffData;
      }

      // 策略2: 透過 email 匹配
      console.log('📋 策略2: 透過 email 查詢');
      ({ data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', authUser.email)
        .maybeSingle());

      if (!error && staffData) {
        console.log('✅ 策略2 成功: 透過 email 找到 staff 記錄');
        console.log('📊 找到的 staff 資料:', {
          staff_id: staffData.id,
          staff_user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role_id: staffData.role_id
        });
        return staffData;
      }

      // 策略3: 透過 staff.id 查詢 (處理舊資料結構)
      console.log('📋 策略3: 透過 staff.id 查詢');
      ({ data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle());

      if (!error && staffData) {
        console.log('✅ 策略3 成功: 透過 staff.id 找到 staff 記錄');
        return staffData;
      }

      console.log('❌ 所有查詢策略都未找到對應的 staff 記錄');
      return null;
    } catch (error) {
      console.error('🔥 查找 staff 記錄時發生錯誤:', error);
      return null;
    }
  }

  /**
   * 更新 staff 記錄的 user_id 映射
   */
  static async updateStaffUserIdMapping(staffId: string, authUserId: string): Promise<void> {
    try {
      console.log('🔄 更新 staff 記錄的 user_id 映射:', {
        staff_id: staffId,
        new_user_id: authUserId
      });
      
      const { error } = await supabase
        .from('staff')
        .update({ user_id: authUserId })
        .eq('id', staffId);

      if (error) {
        console.error('❌ 更新 staff user_id 失敗:', error);
      } else {
        console.log('✅ 成功更新 staff user_id 映射');
      }
    } catch (error) {
      console.error('🔥 更新 staff user_id 時發生錯誤:', error);
    }
  }

  /**
   * 從 Supabase Auth 用戶資料建構 AuthUser - 已重構為 buildUserFromSession
   */
  static async buildUserFromAuth(authUser: SupabaseUser, email: string): Promise<AuthUser> {
    console.log('⚠️ [已棄用] buildUserFromAuth，請使用 buildUserFromSession');
    return await this.buildUserFromSession(authUser, email);
  }

  /**
   * 從員工資料建構 AuthUser，優先使用 role 欄位
   */
  static buildUserFromStaff(authUser: SupabaseUser, staffData: Record<string, unknown>): AuthUser {
    const user: AuthUser = {
      id: authUser.id, // 使用 Supabase Auth 的用戶 ID
      email: authUser.email || (typeof staffData.email === 'string' ? staffData.email : undefined),
      name: typeof staffData.name === 'string' ? staffData.name : undefined,
      position: typeof staffData.position === 'string' ? staffData.position : undefined,
      department: typeof staffData.department === 'string' ? staffData.department : undefined,
      role_id: staffData.role_id as string,
      onboard_date: typeof staffData.onboard_date === 'string' ? staffData.onboard_date : new Date().toISOString().split('T')[0]
    };

    console.log('👤 最終用戶資料:', {
      auth_id: user.id,
      name: user.name,
      email: user.email,
      department: user.department,
      role_id: user.role_id
    });
    
    return user;
  }

  /**
   * 創建 fallback 用戶資料
   */
  static createFallbackUser(authUser: SupabaseUser, email: string): AuthUser {
    let userName = '';
    if (typeof (authUser as { user_metadata?: unknown }).user_metadata === 'object' && authUser && (authUser as { user_metadata?: { name?: unknown } }).user_metadata?.name && typeof (authUser as { user_metadata?: { name?: unknown } }).user_metadata?.name === 'string') {
      userName = (authUser as { user_metadata?: { name?: unknown } }).user_metadata?.name as string;
    } else if (authUser.email && typeof authUser.email === 'string') {
      userName = authUser.email.split('@')[0];
    } else {
      userName = '用戶';
    }
    const fallbackUser: AuthUser = {
      id: authUser.id,
      email: authUser.email || email,
      name: userName,
      position: '員工',
      department: '一般',
      role_id: 'user',
      onboard_date: new Date().toISOString().split('T')[0]
    };

    console.log('⚠️ 使用 fallback 用戶資料:', fallbackUser);
    return fallbackUser;
  }

  /**
   * 自動建立 staff 紀錄
   */
  static async createStaffRecord(authUser: SupabaseUser, email: string): Promise<void> {
    try {
      console.log('➕ 嘗試自動建立 staff 紀錄:', email);
      let userName = '';
      if (typeof (authUser as { user_metadata?: unknown }).user_metadata === 'object' && authUser && (authUser as { user_metadata?: { name?: unknown } }).user_metadata?.name && typeof (authUser as { user_metadata?: { name?: unknown } }).user_metadata?.name === 'string') {
        userName = (authUser as { user_metadata?: { name?: unknown } }).user_metadata?.name as string;
      } else if (authUser.email && typeof authUser.email === 'string') {
        userName = authUser.email.split('@')[0];
      } else {
        userName = '新用戶';
      }
      const newStaffData = {
        user_id: authUser.id,
        name: userName,
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
  static onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
