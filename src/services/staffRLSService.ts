
import { supabase } from '@/integrations/supabase/client';

/**
 * Staff RLS 相關服務
 * 配合新的簡化 RLS 政策
 */
export class StaffRLSService {
  /**
   * 檢查當前用戶是否為超級管理員
   */
  static async isSuperAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const SUPER_ADMIN_UUID = '550e8400-e29b-41d4-a716-446655440001';
      return user?.id === SUPER_ADMIN_UUID;
    } catch (error) {
      console.error('檢查超級管理員權限時發生錯誤:', error);
      return false;
    }
  }

  /**
   * 獲取當前用戶可訪問的員工資料
   */
  static async getAccessibleStaff() {
    try {
      console.log('📋 使用新的 RLS 政策載入員工資料...');
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入員工資料失敗:', error);
        throw error;
      }

      console.log('✅ 員工資料載入成功，筆數:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('❌ 獲取員工資料時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 檢查用戶是否可以編輯特定員工資料
   */
  static async canEditStaff(staffId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      // 超級管理員可以編輯所有資料
      if (await this.isSuperAdmin()) {
        return true;
      }
      
      // 用戶可以編輯自己的資料
      const { data: staffData } = await supabase
        .from('staff')
        .select('user_id, id')
        .eq('id', staffId)
        .single();
      
      return staffData?.user_id === user.id || staffData?.id === user.id;
    } catch (error) {
      console.error('檢查編輯權限時發生錯誤:', error);
      return false;
    }
  }

  /**
   * 驗證 RLS 政策是否正常工作
   */
  static async validateRLSPolicies(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🔍 驗證 RLS 政策...');
      
      // 嘗試查詢員工資料
      const { data, error } = await supabase
        .from('staff')
        .select('id, name, role')
        .limit(5);

      if (error) {
        return {
          success: false,
          message: `RLS 政策驗證失敗: ${error.message}`,
          details: error
        };
      }

      const { data: { user } } = await supabase.auth.getUser();
      const isSuper = await this.isSuperAdmin();

      return {
        success: true,
        message: `RLS 政策驗證成功。當前用戶: ${user?.email}, 超級管理員: ${isSuper}, 可訪問員工數: ${data.length}`,
        details: {
          userEmail: user?.email,
          isSuperAdmin: isSuper,
          accessibleStaffCount: data.length
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `RLS 政策驗證時發生錯誤: ${error}`,
        details: error
      };
    }
  }
}
