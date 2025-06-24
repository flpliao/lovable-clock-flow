
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
   * 從 Supabase staff 表格中查詢並驗證用戶，並載入最新的角色權限
   */
  static async authenticate(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      console.log('🔐 開始驗證用戶:', email);
      
      // 從 staff 表格查詢用戶，並關聯角色資訊
      const { data: staffData, error: queryError } = await supabase
        .from('staff')
        .select(`
          *,
          staff_roles!inner(
            id,
            name,
            is_system_role
          )
        `)
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
      console.log('🔍 用戶角色資訊:', staffData.staff_roles);

      // 根據角色 ID 動態決定用戶權限等級
      let userRole: 'admin' | 'manager' | 'user' = 'user';
      
      // 廖俊雄永遠是最高管理員
      if (staffData.name === '廖俊雄' && staffData.id === '550e8400-e29b-41d4-a716-446655440001') {
        userRole = 'admin';
        console.log('🔐 廖俊雄最高管理員權限');
      } else if (staffData.staff_roles) {
        // 檢查是否為系統角色或管理員角色
        const role = staffData.staff_roles;
        if (role.name === '系統管理員' || role.is_system_role || staffData.role === 'admin') {
          userRole = 'admin';
          console.log('🔐 系統管理員權限:', role.name);
        } else if (role.name.includes('管理') || role.name.includes('主管') || staffData.role === 'manager') {
          userRole = 'manager';
          console.log('🔐 管理者權限:', role.name);
        } else {
          userRole = 'user';
          console.log('🔐 一般用戶權限:', role.name);
        }
      } else {
        // 如果沒有找到角色，使用原始 role 欄位
        userRole = staffData.role as 'admin' | 'manager' | 'user' || 'user';
        console.log('🔐 使用原始角色:', userRole);
      }

      // 構建用戶資料
      const user: AuthUser = {
        id: staffData.id,
        email: staffData.email,
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        role: userRole
      };

      console.log('👤 最終用戶資料:', user);
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
   * 根據 email 查詢用戶資料，包含最新角色權限
   */
  static async findUserByEmail(email: string): Promise<AuthUser | null> {
    try {
      console.log('🔍 查詢用戶:', email);
      
      const { data: staffData, error } = await supabase
        .from('staff')
        .select(`
          *,
          staff_roles(
            id,
            name,
            is_system_role
          )
        `)
        .eq('email', email)
        .single();

      if (error || !staffData) {
        console.log('❌ 未找到用戶:', email);
        return null;
      }

      // 根據角色 ID 動態決定用戶權限等級
      let userRole: 'admin' | 'manager' | 'user' = 'user';
      
      if (staffData.name === '廖俊雄' && staffData.id === '550e8400-e29b-41d4-a716-446655440001') {
        userRole = 'admin';
      } else if (staffData.staff_roles) {
        const role = staffData.staff_roles;
        if (role.name === '系統管理員' || role.is_system_role || staffData.role === 'admin') {
          userRole = 'admin';
        } else if (role.name.includes('管理') || role.name.includes('主管') || staffData.role === 'manager') {
          userRole = 'manager';
        }
      } else {
        userRole = staffData.role as 'admin' | 'manager' | 'user' || 'user';
      }

      return {
        id: staffData.id,
        email: staffData.email,
        name: staffData.name,
        position: staffData.position,
        department: staffData.department,
        role: userRole
      };
    } catch (error) {
      console.error('🔥 查詢用戶時發生錯誤:', error);
      return null;
    }
  }
}
