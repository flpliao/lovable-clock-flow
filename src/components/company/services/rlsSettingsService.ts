
import { supabase } from '@/integrations/supabase/client';

export interface TableRLSStatus {
  tableName: string;
  displayName: string;
  enabled: boolean;
}

export class RLSSettingsService {
  // 定義需要管理的表格
  private static readonly MANAGED_TABLES = [
    { name: 'staff', displayName: '員工資料' },
    { name: 'departments', displayName: '部門資料' },
    { name: 'positions', displayName: '職位管理' },
    { name: 'companies', displayName: '公司資料' },
    { name: 'branches', displayName: '分店資料' },
    { name: 'announcements', displayName: '公告資料' },
    { name: 'leave_requests', displayName: '請假申請' },
    { name: 'check_in_records', displayName: '簽到記錄' },
    { name: 'notifications', displayName: '通知資料' },
    { name: 'annual_leave_balance', displayName: '年假餘額' },
    { name: 'approval_records', displayName: '審批記錄' },
    { name: 'announcement_reads', displayName: '公告閱讀記錄' }
  ];

  /**
   * 獲取全域 RLS 狀態
   */
  static async getRLSStatus(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'global_rls_enabled')
        .maybeSingle();

      if (error) {
        console.error('無法獲取全域 RLS 狀態:', error);
        return true; // 預設啟用
      }

      return data?.setting_value === 'true';
    } catch (error) {
      console.error('獲取全域 RLS 狀態時發生錯誤:', error);
      return true; // 預設啟用
    }
  }

  /**
   * 設定全域 RLS 狀態
   */
  static async setRLSStatus(enabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_key: 'global_rls_enabled',
          setting_value: enabled.toString(),
          description: '全域 Row Level Security 設定'
        });

      if (error) {
        console.error('無法設定全域 RLS 狀態:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('設定全域 RLS 狀態時發生錯誤:', error);
      return false;
    }
  }

  /**
   * 獲取特定表格的 RLS 狀態
   */
  static async getTableRLSStatus(tableName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('get_table_rls_status', {
        table_name: tableName
      });

      if (error) {
        console.error(`無法獲取 ${tableName} 的 RLS 狀態:`, error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error(`獲取 ${tableName} RLS 狀態時發生錯誤:`, error);
      return false;
    }
  }

  /**
   * 獲取所有表格的 RLS 狀態
   */
  static async getAllTableRLSStatus(): Promise<TableRLSStatus[]> {
    const results: TableRLSStatus[] = [];

    for (const table of this.MANAGED_TABLES) {
      try {
        const enabled = await this.getTableRLSStatus(table.name);
        results.push({
          tableName: table.name,
          displayName: table.displayName,
          enabled
        });
      } catch (error) {
        console.error(`獲取 ${table.name} RLS 狀態失敗:`, error);
        // 添加失敗的表格，預設為 false
        results.push({
          tableName: table.name,
          displayName: table.displayName,
          enabled: false
        });
      }
    }

    return results;
  }

  /**
   * 切換特定表格的 RLS 狀態
   */
  static async toggleTableRLS(tableName: string, enabled: boolean): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('toggle_table_rls', {
        table_name: tableName,
        enabled: enabled
      });

      if (error) {
        console.error(`無法切換 ${tableName} 的 RLS 狀態:`, error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error(`切換 ${tableName} RLS 狀態時發生錯誤:`, error);
      return false;
    }
  }

  /**
   * 批量應用全域 RLS 設定
   */
  static async applyGlobalRLSSettings(enabled: boolean): Promise<{ success: boolean; connectionStatus: boolean }> {
    try {
      // 1. 設定全域 RLS 狀態
      const globalResult = await this.setRLSStatus(enabled);
      
      if (!globalResult) {
        return { success: false, connectionStatus: false };
      }

      // 2. 對所有表格應用相同的 RLS 設定
      const applyPromises = this.MANAGED_TABLES.map(table => 
        this.toggleTableRLS(table.name, enabled)
      );

      const results = await Promise.all(applyPromises);
      const allSuccessful = results.every(result => result === true);

      return { 
        success: allSuccessful, 
        connectionStatus: true 
      };
    } catch (error) {
      console.error('應用全域 RLS 設定時發生錯誤:', error);
      return { success: false, connectionStatus: false };
    }
  }
}
