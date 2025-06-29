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
      console.log('👤 Auth 用戶資料:', {
        id: authData.user.id,
        email: authData.user.email
      });

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
      
      // 獲取當前會話用戶
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        return { success: false, error: '無法獲取用戶資料' };
      }

      console.log('👤 當前 Auth 用戶:', {
        id: authUser.id,
        email: authUser.email
      });

      // 嘗試多種方式查詢 staff 資料，解決 ID 不匹配問題
      const staffData = await this.findStaffRecord(authUser);
      
      if (staffData) {
        console.log('✅ 成功匹配 staff 資料:', {
          staff_id: staffData.id,
          auth_user_id: authUser.id,
          staff_user_id: staffData.user_id,
          name: staffData.name,
          email: staffData.email,
          role: staffData.role,
          department: staffData.department
        });
        
        // 如果 staff.user_id 與 auth.id 不匹配，更新 staff 記錄
        if (staffData.user_id !== authUser.id) {
          console.log('🔄 更新 staff 記錄的 user_id 以建立正確關聯');
          await this.updateStaffUserIdMapping(staffData.id, authUser.id);
        }
        
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
   * 嘗試多種方式查找 staff 記錄
   */
  static async findStaffRecord(authUser: User): Promise<any | null> {
    console.log('🔍 嘗試多種方式查找 staff 記錄...');
    
    // 方法1: 透過 user_id 查詢
    console.log('📋 方法1: 透過 user_id 查詢');
    let { data: staffData, error } = await supabase
      .from('staff')
      .select('*')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (!error && staffData) {
      console.log('✅ 方法1 成功: 透過 user_id 找到 staff 記錄');
      return staffData;
    }

    // 方法2: 透過 email 查詢
    console.log('📋 方法2: 透過 email 查詢');
    ({ data: staffData, error } = await supabase
      .from('staff')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle());

    if (!error && staffData) {
      console.log('✅ 方法2 成功: 透過 email 找到 staff 記錄');
      return staffData;
    }

    // 方法3: 透過 staff.id 查詢 (處理舊資料結構)
    console.log('📋 方法3: 透過 staff.id 查詢');
    ({ data: staffData, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle());

    if (!error && staffData) {
      console.log('✅ 方法3 成功: 透過 staff.id 找到 staff 記錄');
      return staffData;
    }

    console.log('❌ 所有查詢方法都未找到對應的 staff 記錄');
    return null;
  }

  /**
   * 更新 staff 記錄的 user_id 映射
   */
  static async updateStaffUserIdMapping(staffId: string, authUserId: string): Promise<void> {
    try {
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
   * 從 Supabase Auth 用戶資料建構 AuthUser
   */
  static async buildUserFromAuth(authUser: User, email: string): Promise<AuthUser> {
    try {
      // 嘗試查找 staff 資料
      const staffData = await this.findStaffRecord(authUser);

      if (staffData) {
        console.log('✅ 從 Auth 流程載入員工資料:', {
          staff_id: staffData.id,
          name: staffData.name,
          role: staffData.role,
          department: staffData.department
        });
        
        // 如果需要，更新 user_id 映射
        if (staffData.user_id !== authUser.id) {
          await this.updateStaffUserIdMapping(staffData.id, authUser.id);
        }
        
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
    
    // �廖俊雄永遠是最高管理員（超級管理員檢查）
    if (staffData.name === '廖俊雄' || staffData.email === 'flpliao@gmail.com' || authUser.id === '550e8400-e29b-41d4-a716-446655440001') {
      userRole = 'admin';
      console.log('🔐 �廖俊雄超級管理員權限確認');
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
      auth_id: user.id,
      staff_id: staffData.id,
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
