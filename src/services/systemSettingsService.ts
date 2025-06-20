
import { supabase } from '@/integrations/supabase/client';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export class SystemSettingsService {
  /**
   * 取得打卡距離限制設定
   */
  static async getCheckInDistanceLimit(): Promise<number> {
    try {
      console.log('🔍 嘗試取得打卡距離限制設定...');
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'check_in_distance_limit')
        .maybeSingle();

      if (error) {
        console.error('❌ 無法取得打卡距離限制設定:', error);
        return 500; // 預設值
      }

      if (data) {
        const value = parseInt(data.setting_value);
        console.log('✅ 成功取得打卡距離限制:', value, '公尺');
        return isNaN(value) ? 500 : value;
      }

      console.log('⚠️ 未找到打卡距離限制設定，使用預設值: 500公尺');
      return 500; // 預設值
    } catch (error) {
      console.error('❌ 取得打卡距離限制時發生錯誤:', error);
      return 500; // 預設值
    }
  }

  /**
   * 設定打卡距離限制
   */
  static async setCheckInDistanceLimit(distance: number): Promise<boolean> {
    try {
      console.log('💾 嘗試設定打卡距離限制:', distance, '公尺');
      
      // 先檢查是否已存在設定
      const { data: existingSetting, error: selectError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', 'check_in_distance_limit')
        .maybeSingle();

      if (selectError) {
        console.error('❌ 檢查現有設定時發生錯誤:', selectError);
        return false;
      }

      let result;
      
      if (existingSetting) {
        // 更新現有設定
        console.log('🔄 更新現有設定...');
        result = await supabase
          .from('system_settings')
          .update({
            setting_value: distance.toString(),
            description: '打卡距離限制（公尺）',
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', 'check_in_distance_limit');
      } else {
        // 新增設定
        console.log('➕ 新增設定...');
        result = await supabase
          .from('system_settings')
          .insert({
            setting_key: 'check_in_distance_limit',
            setting_value: distance.toString(),
            description: '打卡距離限制（公尺）'
          });
      }

      if (result.error) {
        console.error('❌ 設定打卡距離限制失敗:', result.error);
        console.error('錯誤詳情:', result.error.message);
        console.error('錯誤代碼:', result.error.code);
        return false;
      }

      console.log('✅ 打卡距離限制已更新為:', distance, '公尺');
      return true;
    } catch (error) {
      console.error('❌ 設定打卡距離限制時發生錯誤:', error);
      return false;
    }
  }

  /**
   * 初始化預設系統設定
   */
  static async initializeDefaultSettings(): Promise<void> {
    try {
      console.log('🔧 初始化預設系統設定...');
      
      // 檢查是否已存在打卡距離限制設定
      const { data: existing, error: selectError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', 'check_in_distance_limit')
        .maybeSingle();

      if (selectError) {
        console.error('❌ 檢查現有設定時發生錯誤:', selectError);
        return;
      }

      if (!existing) {
        // 建立預設設定
        const success = await this.setCheckInDistanceLimit(500);
        if (success) {
          console.log('✅ 已初始化預設打卡距離限制: 500公尺');
        } else {
          console.error('❌ 初始化預設打卡距離限制失敗');
        }
      } else {
        console.log('✅ 打卡距離限制設定已存在');
      }
    } catch (error) {
      console.error('❌ 初始化系統設定時發生錯誤:', error);
    }
  }

  /**
   * 測試 RLS 政策和權限
   */
  static async testRLSAndPermissions(): Promise<{ canRead: boolean; canWrite: boolean; error?: string }> {
    try {
      console.log('🧪 測試 RLS 政策和權限...');
      
      // 測試讀取權限
      const { data: readData, error: readError } = await supabase
        .from('system_settings')
        .select('*')
        .limit(1);

      const canRead = !readError;
      if (readError) {
        console.error('❌ 讀取權限測試失敗:', readError);
      } else {
        console.log('✅ 讀取權限正常');
      }

      // 測試寫入權限
      const testKey = `test_${Date.now()}`;
      const { error: writeError } = await supabase
        .from('system_settings')
        .insert({
          setting_key: testKey,
          setting_value: 'test_value',
          description: '測試設定'
        });

      let canWrite = !writeError;
      
      if (writeError) {
        console.error('❌ 寫入權限測試失敗:', writeError);
      } else {
        console.log('✅ 寫入權限正常');
        
        // 清理測試資料
        await supabase
          .from('system_settings')
          .delete()
          .eq('setting_key', testKey);
      }

      return {
        canRead,
        canWrite,
        error: writeError?.message || readError?.message
      };
    } catch (error) {
      console.error('❌ 權限測試時發生錯誤:', error);
      return {
        canRead: false,
        canWrite: false,
        error: error instanceof Error ? error.message : '未知錯誤'
      };
    }
  }
}
