
import { supabase } from '@/integrations/supabase/client';

export class RLSSettingsService {
  // 獲取 RLS 設定狀態
  static async getRLSStatus(): Promise<boolean> {
    console.log('🔍 RLSSettingsService: 查詢 RLS 設定狀態...');
    
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'rls_enabled')
        .maybeSingle();

      if (error) {
        console.error('❌ RLSSettingsService: 查詢 RLS 設定失敗:', error);
        return false; // 預設為關閉
      }

      const isEnabled = data?.setting_value === 'true';
      console.log('✅ RLSSettingsService: RLS 設定狀態:', isEnabled ? '開啟' : '關閉');
      return isEnabled;
    } catch (error) {
      console.error('❌ RLSSettingsService: 查詢過程發生錯誤:', error);
      return false;
    }
  }

  // 更新 RLS 設定
  static async updateRLSStatus(enabled: boolean): Promise<boolean> {
    console.log('🔄 RLSSettingsService: 更新 RLS 設定為:', enabled ? '開啟' : '關閉');
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: enabled.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'rls_enabled');

      if (error) {
        console.error('❌ RLSSettingsService: 更新 RLS 設定失敗:', error);
        return false;
      }

      console.log('✅ RLSSettingsService: RLS 設定更新成功');
      return true;
    } catch (error) {
      console.error('❌ RLSSettingsService: 更新過程發生錯誤:', error);
      return false;
    }
  }

  // 應用 RLS 設定到所有表格
  static async applyRLSSettings(enabled: boolean): Promise<boolean> {
    console.log('🔧 RLSSettingsService: 應用 RLS 設定到所有表格:', enabled ? '開啟' : '關閉');
    
    const tables = [
      'companies',
      'branches', 
      'staff',
      'announcements',
      'leave_requests',
      'check_in_records',
      'notifications',
      'annual_leave_balance',
      'approval_records',
      'announcement_reads'
    ];

    try {
      // 注意: 實際環境中這裡需要通過 RPC 函數來執行 ALTER TABLE 指令
      // 因為客戶端無法直接執行 DDL 語句
      console.log('⚠️ RLSSettingsService: 客戶端無法直接執行 DDL，需要通過後端 API 或 RPC 函數');
      
      // 這裡只更新設定，實際的 RLS 啟用/禁用需要通過後端處理
      const updateSuccess = await this.updateRLSStatus(enabled);
      
      if (updateSuccess) {
        console.log('✅ RLSSettingsService: RLS 設定已儲存，需要後端應用到資料庫');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ RLSSettingsService: 應用 RLS 設定失敗:', error);
      return false;
    }
  }
}
