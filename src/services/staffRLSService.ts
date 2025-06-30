
import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';

/**
 * Staff RLS 相關服務
 * 使用新的安全 RLS 政策
 */
export class StaffRLSService {
  /**
   * 檢查當前用戶是否為超級管理員
   */
  static async isSuperAdmin(): Promise<boolean> {
    return await securityService.isSuperAdmin();
  }

  /**
   * 檢查當前用戶是否為管理員
   */
  static async isAdmin(): Promise<boolean> {
    return await securityService.isAdmin();
  }

  /**
   * 獲取當前用戶可訪問的員工資料
   */
  static async getAccessibleStaff() {
    try {
      console.log('📋 使用安全 RLS 政策載入員工資料...');
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入員工資料失敗:', error);
        await securityService.logSecurityEvent('staff_data_load_failed', { error });
        throw error;
      }

      console.log('✅ 員工資料載入成功，筆數:', data?.length || 0);
      await securityService.logSecurityEvent('staff_data_loaded', { count: data?.length || 0 });
      
      return data || [];
    } catch (error) {
      console.error('❌ 獲取員工資料時發生錯誤:', error);
      await securityService.logSecurityEvent('staff_data_access_error', { error });
      throw error;
    }
  }

  /**
   * 檢查用戶是否可以編輯特定員工資料
   */
  static async canEditStaff(staffId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        await securityService.logSecurityEvent('staff_edit_check_no_user', { staffId });
        return false;
      }
      
      // 超級管理員可以編輯所有資料
      if (await this.isSuperAdmin()) {
        await securityService.logSecurityEvent('staff_edit_granted_super_admin', { staffId });
        return true;
      }
      
      // 管理員可以編輯所有資料
      if (await this.isAdmin()) {
        await securityService.logSecurityEvent('staff_edit_granted_admin', { staffId });
        return true;
      }
      
      // 用戶可以編輯自己的資料
      const { data: staffData } = await supabase
        .from('staff')
        .select('user_id, id')
        .eq('id', staffId)
        .single();
      
      const canEdit = staffData?.user_id === user.id || staffData?.id === user.id;
      
      await securityService.logSecurityEvent(
        canEdit ? 'staff_edit_granted_self' : 'staff_edit_denied',
        { staffId, userId: user.id }
      );
      
      return canEdit;
    } catch (error) {
      console.error('檢查編輯權限時發生錯誤:', error);
      await securityService.logSecurityEvent('staff_edit_check_error', { staffId, error });
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
      console.log('🔍 驗證安全 RLS 政策...');
      
      // 測試 RLS 政策
      const { data: testData, error } = await supabase.rpc('test_staff_rls');
      
      if (error) {
        await securityService.logSecurityEvent('rls_validation_failed', { error });
        return {
          success: false,
          message: `RLS 政策驗證失敗: ${error.message}`,
          details: error
        };
      }

      // 嘗試查詢員工資料
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, role')
        .limit(10);

      if (staffError) {
        await securityService.logSecurityEvent('staff_query_failed', { error: staffError });
        return {
          success: false,
          message: `員工資料查詢失敗: ${staffError.message}`,
          details: staffError
        };
      }

      const { data: { user } } = await supabase.auth.getUser();
      const isSuper = await this.isSuperAdmin();
      const isAdmin = await this.isAdmin();

      const result = {
        success: true,
        message: `RLS 政策驗證成功。當前用戶: ${user?.email}, 超級管理員: ${isSuper}, 管理員: ${isAdmin}, 可訪問員工數: ${staffData?.length || 0}`,
        details: {
          userEmail: user?.email,
          isSuperAdmin: isSuper,
          isAdmin: isAdmin,
          accessibleStaffCount: staffData?.length || 0,
          testResults: testData
        }
      };

      await securityService.logSecurityEvent('rls_validation_success', result.details);
      return result;
    } catch (error) {
      await securityService.logSecurityEvent('rls_validation_error', { error });
      return {
        success: false,
        message: `RLS 政策驗證時發生錯誤: ${error}`,
        details: error
      };
    }
  }
}
