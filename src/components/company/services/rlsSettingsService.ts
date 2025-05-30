
import { supabase } from '@/integrations/supabase/client';

export interface TableRLSStatus {
  tableName: string;
  displayName: string;
  enabled: boolean;
  description: string;
}

export class RLSSettingsService {
  // 支援的表格清單
  static readonly SUPPORTED_TABLES = [
    { name: 'staff', displayName: '員工表格', description: '控制員工資料的存取權限' },
    { name: 'departments', displayName: '部門表格', description: '控制部門資料的存取權限' },
    { name: 'companies', displayName: '公司表格', description: '控制公司資料的存取權限' },
    { name: 'branches', displayName: '營業處表格', description: '控制營業處資料的存取權限' },
    { name: 'announcements', displayName: '公告表格', description: '控制公告資料的存取權限' },
    { name: 'leave_requests', displayName: '請假申請表格', description: '控制請假申請的存取權限' },
    { name: 'check_in_records', displayName: '打卡記錄表格', description: '控制打卡記錄的存取權限' },
    { name: 'notifications', displayName: '通知表格', description: '控制通知資料的存取權限' }
  ];

  // 獲取全域 RLS 設定狀態
  static async getRLSStatus(): Promise<boolean> {
    console.log('🔍 RLSSettingsService: 查詢全域 RLS 設定狀態...');
    
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'rls_enabled')
        .maybeSingle();

      if (error) {
        console.error('❌ RLSSettingsService: 查詢全域 RLS 設定失敗:', error);
        return false;
      }

      const isEnabled = data?.setting_value === 'true';
      console.log('✅ RLSSettingsService: 全域 RLS 設定狀態:', isEnabled ? '開啟' : '關閉');
      return isEnabled;
    } catch (error) {
      console.error('❌ RLSSettingsService: 查詢過程發生錯誤:', error);
      return false;
    }
  }

  // 獲取所有表格的 RLS 狀態
  static async getAllTableRLSStatus(): Promise<TableRLSStatus[]> {
    console.log('🔍 RLSSettingsService: 查詢所有表格 RLS 狀態...');
    
    try {
      const results: TableRLSStatus[] = [];
      
      for (const table of this.SUPPORTED_TABLES) {
        const { data, error } = await supabase
          .rpc('get_table_rls_status', { table_name: table.name });

        if (error) {
          console.error(`❌ 查詢 ${table.name} RLS 狀態失敗:`, error);
          results.push({
            tableName: table.name,
            displayName: table.displayName,
            enabled: false,
            description: table.description
          });
        } else {
          results.push({
            tableName: table.name,
            displayName: table.displayName,
            enabled: data || false,
            description: table.description
          });
        }
      }

      console.log('✅ RLSSettingsService: 所有表格 RLS 狀態已獲取');
      return results;
    } catch (error) {
      console.error('❌ RLSSettingsService: 獲取表格 RLS 狀態失敗:', error);
      return this.SUPPORTED_TABLES.map(table => ({
        tableName: table.name,
        displayName: table.displayName,
        enabled: false,
        description: table.description
      }));
    }
  }

  // 切換特定表格的 RLS 狀態
  static async toggleTableRLS(tableName: string, enabled: boolean): Promise<boolean> {
    console.log(`🔄 RLSSettingsService: 切換 ${tableName} RLS 狀態為:`, enabled ? '開啟' : '關閉');
    
    try {
      const { data, error } = await supabase
        .rpc('toggle_table_rls', { 
          table_name: tableName, 
          enabled: enabled 
        });

      if (error || !data) {
        console.error(`❌ RLSSettingsService: 切換 ${tableName} RLS 失敗:`, error);
        return false;
      }

      // 同時更新系統設定記錄
      const settingKey = `rls_${tableName}_enabled`;
      await supabase
        .from('system_settings')
        .update({ 
          setting_value: enabled.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', settingKey);

      console.log(`✅ RLSSettingsService: ${tableName} RLS 狀態更新成功`);
      return true;
    } catch (error) {
      console.error(`❌ RLSSettingsService: 切換 ${tableName} RLS 過程發生錯誤:`, error);
      return false;
    }
  }

  // 更新全域 RLS 設定
  static async updateRLSStatus(enabled: boolean): Promise<boolean> {
    console.log('🔄 RLSSettingsService: 更新全域 RLS 設定為:', enabled ? '開啟' : '關閉');
    
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ 
          setting_value: enabled.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'rls_enabled');

      if (error) {
        console.error('❌ RLSSettingsService: 更新全域 RLS 設定失敗:', error);
        return false;
      }

      console.log('✅ RLSSettingsService: 全域 RLS 設定更新成功');
      return true;
    } catch (error) {
      console.error('❌ RLSSettingsService: 更新過程發生錯誤:', error);
      return false;
    }
  }

  // 應用全域 RLS 設定到所有表格
  static async applyGlobalRLSSettings(enabled: boolean): Promise<boolean> {
    console.log('🔧 RLSSettingsService: 應用全域 RLS 設定到所有表格:', enabled ? '開啟' : '關閉');
    
    try {
      const updateSuccess = await this.updateRLSStatus(enabled);
      
      if (updateSuccess) {
        console.log('✅ RLSSettingsService: 全域 RLS 設定已儲存');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ RLSSettingsService: 應用全域 RLS 設定失敗:', error);
      return false;
    }
  }
}
