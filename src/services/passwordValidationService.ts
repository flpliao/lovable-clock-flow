import { supabase } from '@/integrations/supabase/client';

export class PasswordValidationService {
  /**
   * 驗證當前密碼是否正確
   * 使用 Supabase Auth API 進行驗證
   */
  static async validateCurrentPassword(currentPassword: string): Promise<boolean> {
    try {
      console.log('🔐 開始驗證當前密碼...');
      
      // 獲取當前用戶的電子郵件
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user?.email) {
        console.error('❌ 無法獲取當前用戶資訊:', userError);
        return false;
      }
      
      console.log('👤 當前用戶:', user.email);
      
      // 嘗試使用當前密碼登入來驗證密碼是否正確
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });
      
      if (authError) {
        console.log('❌ 密碼驗證失敗:', authError.message);
        return false;
      }
      
      if (!authData.user || !authData.session) {
        console.log('❌ 密碼驗證失敗：未獲取到用戶資料或會話');
        return false;
      }
      
      console.log('✅ 密碼驗證成功');
      return true;
      
    } catch (error) {
      console.error('🔥 密碼驗證過程中發生錯誤:', error);
      return false;
    }
  }

  /**
   * 更新用戶密碼
   * 使用 Supabase Auth API 更新密碼
   */
  static async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔄 開始更新密碼...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        console.error('❌ 密碼更新失敗:', error);
        return { 
          success: false, 
          error: error.message || '密碼更新失敗' 
        };
      }
      
      console.log('✅ 密碼更新成功');
      return { success: true };
      
    } catch (error) {
      console.error('🔥 密碼更新過程中發生錯誤:', error);
      return { 
        success: false, 
        error: '密碼更新失敗，請稍後再試' 
      };
    }
  }
} 