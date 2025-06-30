
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
      const SUPER_ADMIN_UUID = '0765138a-6f11-45f4-be07-dab965116a2d';
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
   * 驗證 RLS 政策是否正常工作 - 使用安全的方式避免遞迴
   */
  static async validateRLSPolicies(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🔍 驗證 RLS 政策...');
      
      // 使用資料庫函數來檢查 RLS 狀態，避免直接查詢觸發遞迴
      const { data: debugData, error: debugError } = await supabase.rpc('debug_auth_status');
      
      if (debugError) {
        console.error('❌ 執行 debug_auth_status 失敗:', debugError);
        return {
          success: false,
          message: `RLS 政策驗證失敗: ${debugError.message}`,
          details: debugError
        };
      }

      // 檢查管理員權限函數
      const { data: isAdmin, error: adminError } = await supabase.rpc('is_current_user_admin_safe');
      
      if (adminError) {
        console.error('❌ 檢查管理員權限失敗:', adminError);
        return {
          success: false,
          message: `管理員權限檢查失敗: ${adminError.message}`,
          details: adminError
        };
      }

      // 測試 RLS 政策函數
      const { data: rlsTest, error: rlsTestError } = await supabase.rpc('test_staff_rls');
      
      if (rlsTestError) {
        console.error('❌ RLS 測試失敗:', rlsTestError);
        return {
          success: false,
          message: `RLS 測試失敗: ${rlsTestError.message}`,
          details: rlsTestError
        };
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      return {
        success: true,
        message: `RLS 政策驗證成功。當前用戶: ${user?.email}, 超級管理員: ${isAdmin}, 認證狀態正常`,
        details: {
          userEmail: user?.email,
          userId: user?.id,
          isSuperAdmin: isAdmin,
          debugInfo: debugData,
          rlsTestResults: rlsTest,
          authStatus: 'verified'
        }
      };
    } catch (error) {
      console.error('❌ RLS 政策驗證系統錯誤:', error);
      return {
        success: false,
        message: `RLS 政策驗證時發生錯誤: ${error}`,
        details: error
      };
    }
  }
}
