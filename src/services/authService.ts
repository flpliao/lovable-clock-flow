
import { supabase } from '@/integrations/supabase/client';

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
   * 使用 email 和 password 進行登入驗證
   * 從 Supabase staff 表格中查詢並驗證用戶
   */
  static async authenticate(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      console.log('🔐 開始驗證用戶:', email);
      
      // 從 staff 表格查詢用戶
      const { data: staffData, error: queryError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (queryError) {
        console.log('❌ 查詢用戶失敗:', queryError);
        return { 
          success: false, 
          error: '帳號或密碼錯誤' 
        };
      }

      if (!staffData) {
        console.log('❌ 未找到用戶');
        return { 
          success: false, 
          error: '帳號或密碼錯誤' 
        };
      }

      console.log('✅ 用戶驗證成功:', staffData.name);

      // 構建用戶資料
      const user: AuthUser = {
        id: staffData.id,
        email: staffData.email,
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        role: staffData.role as 'admin' | 'manager' | 'user'
      };

      return { success: true, user };
    } catch (error) {
      console.error('🔥 驗證過程中發生錯誤:', error);
      return { 
        success: false, 
        error: '系統錯誤，請稍後再試' 
      };
    }
  }

  /**
   * 根據 email 查詢用戶資料
   */
  static async findUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      console.log('🔍 查詢用戶:', email);
      
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !staffData) {
        console.log('❌ 未找到用戶:', email);
        return null;
      }

      return {
        id: staffData.id,
        email: staffData.email,
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        role: staffData.role as 'admin' | 'manager' | 'user'
      };
    } catch (error) {
      console.error('🔥 查詢用戶時發生錯誤:', error);
      return null;
    }
  }
}
