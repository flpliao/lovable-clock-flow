
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
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'check_in_distance_limit')
        .maybeSingle();

      if (error) {
        console.error('無法取得打卡距離限制設定:', error);
        return 500; // 預設值
      }

      if (data) {
        const value = parseInt(data.setting_value);
        return isNaN(value) ? 500 : value;
      }

      return 500; // 預設值
    } catch (error) {
      console.error('取得打卡距離限制時發生錯誤:', error);
      return 500; // 預設值
    }
  }

  /**
   * 設定打卡距離限制
   */
  static async setCheckInDistanceLimit(distance: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'check_in_distance_limit',
          setting_value: distance.toString(),
          description: '打卡距離限制（公尺）'
        });

      if (error) {
        console.error('無法設定打卡距離限制:', error);
        return false;
      }

      console.log('✅ 打卡距離限制已更新為:', distance, '公尺');
      return true;
    } catch (error) {
      console.error('設定打卡距離限制時發生錯誤:', error);
      return false;
    }
  }

  /**
   * 初始化預設系統設定
   */
  static async initializeDefaultSettings(): Promise<void> {
    try {
      // 檢查是否已存在打卡距離限制設定
      const { data: existing } = await supabase
        .from('system_settings')
        .select('id')
        .eq('setting_key', 'check_in_distance_limit')
        .maybeSingle();

      if (!existing) {
        // 建立預設設定
        await this.setCheckInDistanceLimit(500);
        console.log('✅ 已初始化預設打卡距離限制: 500公尺');
      }
    } catch (error) {
      console.error('初始化系統設定時發生錯誤:', error);
    }
  }
}
