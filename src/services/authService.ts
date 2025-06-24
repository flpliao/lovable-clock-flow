
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
      
      // 先從 staff 表格查詢用戶基本資料
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
      console.log('👤 員工資料:', { 
        name: staffData.name, 
        role_id: staffData.role_id, 
        old_role: staffData.role 
      });

      // 根據 role_id 決定用戶權限等級
      let userRole: 'admin' | 'manager' | 'user' = 'user';
      
      // 廖俊雄永遠是最高管理員
      if (staffData.name === '廖俊雄' && staffData.id === '550e8400-e29b-41d4-a716-446655440001') {
        userRole = 'admin';
        console.log('🔐 廖俊雄最高管理員權限');
      } else {
        // 對於其他用戶，嚴格基於 role_id 查詢角色權限
        if (staffData.role_id && staffData.role_id !== 'user') {
          // 查詢 staff_roles 表格
          const { data: roleInfo, error: roleError } = await supabase
            .from('staff_roles')
            .select('*')
            .eq('id', staffData.role_id)
            .single();

          if (!roleError && roleInfo) {
            console.log('🔍 角色詳細資訊:', roleInfo);
            
            // 檢查是否為系統管理員角色
            if (roleInfo.name === '系統管理員' || roleInfo.is_system_role === true) {
              userRole = 'admin';
              console.log('🔐 系統管理員權限:', roleInfo.name);
            } 
            // 檢查是否為管理相關角色
            else if (roleInfo.name.includes('管理') || roleInfo.name.includes('主管') || roleInfo.name.includes('經理')) {
              userRole = 'manager';
              console.log('🔐 管理者權限:', roleInfo.name);
            } 
            // 其他角色都為一般用戶
            else {
              userRole = 'user';
              console.log('🔐 一般用戶權限:', roleInfo.name);
            }
          } else {
            console.log('⚠️ 無法載入角色資訊，使用預設權限 user');
            userRole = 'user';
          }
        } else {
          console.log('⚠️ 員工 role_id 為 user 或未設定，使用預設權限 user');
          userRole = 'user';
        }
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
      
      // 先查詢 staff 基本資料
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !staffData) {
        console.log('❌ 未找到用戶:', email);
        return null;
      }

      console.log('👤 員工資料:', { 
        name: staffData.name, 
        role_id: staffData.role_id, 
        old_role: staffData.role 
      });

      // 根據 role_id 決定用戶權限等級
      let userRole: 'admin' | 'manager' | 'user' = 'user';
      
      // 廖俊雄永遠是最高管理員
      if (staffData.name === '廖俊雄' && staffData.id === '550e8400-e29b-41d4-a716-446655440001') {
        userRole = 'admin';
        console.log('🔐 廖俊雄最高管理員權限');
      } else {
        // 對於其他用戶，嚴格基於 role_id 查詢角色權限
        if (staffData.role_id && staffData.role_id !== 'user') {
          // 查詢 staff_roles 表格
          const { data: roleInfo, error: roleError } = await supabase
            .from('staff_roles')
            .select('*')
            .eq('id', staffData.role_id)
            .single();

          if (!roleError && roleInfo) {
            console.log('🔍 角色詳細資訊:', roleInfo);
            
            // 檢查是否為系統管理員角色
            if (roleInfo.name === '系統管理員' || roleInfo.is_system_role === true) {
              userRole = 'admin';
              console.log('🔐 系統管理員權限:', roleInfo.name);
            } 
            // 檢查是否為管理相關角色
            else if (roleInfo.name.includes('管理') || roleInfo.name.includes('主管') || roleInfo.name.includes('經理')) {
              userRole = 'manager';
              console.log('🔐 管理者權限:', roleInfo.name);
            } 
            // 其他角色都為一般用戶
            else {
              userRole = 'user';
              console.log('🔐 一般用戶權限:', roleInfo.name);
            }
          } else {
            console.log('⚠️ 無法載入角色資訊，使用預設權限 user');
            userRole = 'user';
          }
        } else {
          console.log('⚠️ 員工 role_id 為 user 或未設定，使用預設權限 user');
          userRole = 'user';
        }
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
