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
   * 檢查用戶權限
   */
  static async checkUserPermissions(): Promise<{ canRead: boolean; canWrite: boolean; error?: string }> {
    try {
      console.log('🔐 檢查用戶權限...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        return {
          canRead: false,
          canWrite: false,
          error: '用戶未登入'
        };
      }

      console.log('👤 當前用戶:', user.id);

      // 檢查用戶角色
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role, name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (staffError) {
        console.error('❌ 無法取得員工資料:', staffError);
        return {
          canRead: false,
          canWrite: false,
          error: '無法驗證用戶權限'
        };
      }

      if (!staffData) {
        console.error('❌ 找不到員工資料');
        return {
          canRead: false,
          canWrite: false,
          error: '找不到員工資料'
        };
      }

      console.log('👤 員工資料:', staffData);

      const canWrite = staffData.role_id === 'admin' || staffData.role_id === 'manager';
      const canRead = true; // 所有認證用戶都可以讀取

      return {
        canRead,
        canWrite,
        error: canWrite ? undefined : '沒有寫入權限，需要管理員或主管權限'
      };

    } catch (error) {
      console.error('❌ 權限檢查錯誤:', error);
      return {
        canRead: false,
        canWrite: false,
        error: error instanceof Error ? error.message : '權限檢查失敗'
      };
    }
  }

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
      
      // 先檢查權限
      const permissions = await this.checkUserPermissions();
      if (!permissions.canWrite) {
        console.error('❌ 沒有寫入權限:', permissions.error);
        throw new Error(permissions.error || '沒有寫入權限');
      }

      // 檢查是否已存在設定
      const { data: existingSetting, error: selectError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', 'check_in_distance_limit')
        .maybeSingle();

      if (selectError) {
        console.error('❌ 檢查現有設定時發生錯誤:', selectError);
        throw new Error(`檢查設定失敗: ${selectError.message}`);
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
        throw new Error(`儲存失敗: ${result.error.message}`);
      }

      console.log('✅ 打卡距離限制已更新為:', distance, '公尺');
      return true;
    } catch (error) {
      console.error('❌ 設定打卡距離限制時發生錯誤:', error);
      throw error; // 重新拋出錯誤讓上層處理
    }
  }

  /**
   * 取得 Google Maps API 金鑰
   */
  static async getGoogleMapsApiKey(): Promise<string | null> {
    try {
      console.log('🔍 嘗試取得 Google Maps API 金鑰...');
      
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'google_maps_api_key')
        .maybeSingle();

      if (error) {
        console.error('❌ 無法取得 Google Maps API 金鑰:', error);
        return null;
      }

      if (data) {
        console.log('✅ 成功取得 Google Maps API 金鑰');
        return data.setting_value;
      }

      console.log('⚠️ 未找到 Google Maps API 金鑰設定');
      return null;
    } catch (error) {
      console.error('❌ 取得 Google Maps API 金鑰時發生錯誤:', error);
      return null;
    }
  }

  /**
   * 設定 Google Maps API 金鑰
   */
  static async setGoogleMapsApiKey(apiKey: string): Promise<boolean> {
    try {
      console.log('💾 嘗試設定 Google Maps API 金鑰...');
      
      // 先檢查是否已存在設定
      const { data: existingSetting, error: selectError } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', 'google_maps_api_key')
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
            setting_value: apiKey,
            description: 'Google Maps API 金鑰',
            updated_at: new Date().toISOString()
          })
          .eq('setting_key', 'google_maps_api_key');
      } else {
        // 新增設定
        console.log('➕ 新增設定...');
        result = await supabase
          .from('system_settings')
          .insert({
            setting_key: 'google_maps_api_key',
            setting_value: apiKey,
            description: 'Google Maps API 金鑰'
          });
      }

      if (result.error) {
        console.error('❌ 設定 Google Maps API 金鑰失敗:', result.error);
        return false;
      }

      console.log('✅ Google Maps API 金鑰已更新');
      return true;
    } catch (error) {
      console.error('❌ 設定 Google Maps API 金鑰時發生錯誤:', error);
      return false;
    }
  }

  /**
   * 初始化預設系統設定
   */
  static async initializeDefaultSettings(): Promise<void> {
    try {
      console.log('🔧 初始化預設系統設定...');
      
      // 檢查權限
      const permissions = await this.checkUserPermissions();
      if (!permissions.canWrite) {
        console.log('⚠️ 沒有寫入權限，跳過初始化');
        return;
      }
      
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
    return await this.checkUserPermissions();
  }
}
