
import { supabase } from '@/integrations/supabase/client';

export interface TableRLSStatus {
  tableName: string;
  displayName: string;
  enabled: boolean;
  policyCount?: number;
  hasSelectPolicy?: boolean;
  hasInsertPolicy?: boolean;
  hasUpdatePolicy?: boolean;
  hasDeletePolicy?: boolean;
}

export interface RLSPolicySummary {
  table_name: string;
  rls_enabled: boolean;
  policy_count: number;
  has_select_policy: boolean;
  has_insert_policy: boolean;
  has_update_policy: boolean;
  has_delete_policy: boolean;
}

export class RLSSettingsService {
  // 擴展的表格管理清單
  private static readonly MANAGED_TABLES = [
    { name: 'staff', displayName: '員工資料', category: 'core' },
    { name: 'departments', displayName: '部門資料', category: 'organization' },
    { name: 'positions', displayName: '職位管理', category: 'organization' },
    { name: 'companies', displayName: '公司資料', category: 'organization' },
    { name: 'branches', displayName: '分店資料', category: 'organization' },
    { name: 'announcements', displayName: '公告資料', category: 'communication' },
    { name: 'leave_requests', displayName: '請假申請', category: 'workflow' },
    { name: 'check_in_records', displayName: '簽到記錄', category: 'attendance' },
    { name: 'notifications', displayName: '通知資料', category: 'communication' },
    { name: 'annual_leave_balance', displayName: '年假餘額', category: 'workflow' },
    { name: 'approval_records', displayName: '審批記錄', category: 'workflow' },
    { name: 'announcement_reads', displayName: '公告閱讀記錄', category: 'communication' },
    { name: 'system_settings', displayName: 'GPS打卡距離設定', category: 'system' },
    { name: 'missed_checkin_requests', displayName: '補簽申請', category: 'attendance' },
    { name: 'missed_checkin_approval_records', displayName: '補簽審批記錄', category: 'attendance' },
    { name: 'overtime_requests', displayName: '加班申請', category: 'workflow' },
    { name: 'overtime_approval_records', displayName: '加班審批記錄', category: 'workflow' }
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
      console.log(`檢查 ${tableName} 的 RLS 狀態...`);
      
      const { data, error } = await supabase.rpc('get_table_rls_status', {
        table_name: tableName
      });

      if (error) {
        console.error(`無法獲取 ${tableName} 的 RLS 狀態:`, error);
        return false;
      }

      console.log(`${tableName} RLS 狀態:`, data);
      return data || false;
    } catch (error) {
      console.error(`獲取 ${tableName} RLS 狀態時發生錯誤:`, error);
      return false;
    }
  }

  /**
   * 獲取所有表格的詳細 RLS 政策摘要
   */
  static async getAllTableRLSPolicySummary(): Promise<RLSPolicySummary[]> {
    try {
      console.log('獲取所有表格的 RLS 政策摘要...');
      
      const { data, error } = await supabase.rpc('get_rls_policy_summary');

      if (error) {
        console.error('無法獲取 RLS 政策摘要:', error);
        return [];
      }

      console.log('RLS 政策摘要:', data);
      return data || [];
    } catch (error) {
      console.error('獲取 RLS 政策摘要時發生錯誤:', error);
      return [];
    }
  }

  /**
   * 獲取所有表格的 RLS 狀態
   */
  static async getAllTableRLSStatus(): Promise<TableRLSStatus[]> {
    try {
      // 獲取政策摘要
      const policySummaries = await this.getAllTableRLSPolicySummary();
      const summaryMap = new Map(policySummaries.map(s => [s.table_name, s]));

      const results: TableRLSStatus[] = [];

      for (const table of this.MANAGED_TABLES) {
        try {
          const summary = summaryMap.get(table.name);
          const enabled = summary?.rls_enabled || false;
          
          results.push({
            tableName: table.name,
            displayName: table.displayName,
            enabled,
            policyCount: summary?.policy_count || 0,
            hasSelectPolicy: summary?.has_select_policy || false,
            hasInsertPolicy: summary?.has_insert_policy || false,
            hasUpdatePolicy: summary?.has_update_policy || false,
            hasDeletePolicy: summary?.has_delete_policy || false
          });
        } catch (error) {
          console.error(`獲取 ${table.name} RLS 狀態失敗:`, error);
          // 添加失敗的表格，預設為 false
          results.push({
            tableName: table.name,
            displayName: table.displayName,
            enabled: false,
            policyCount: 0,
            hasSelectPolicy: false,
            hasInsertPolicy: false,
            hasUpdatePolicy: false,
            hasDeletePolicy: false
          });
        }
      }

      return results;
    } catch (error) {
      console.error('獲取所有表格 RLS 狀態時發生錯誤:', error);
      return [];
    }
  }

  /**
   * 切換特定表格的 RLS 狀態
   */
  static async toggleTableRLS(tableName: string, enabled: boolean): Promise<boolean> {
    try {
      console.log(`切換 ${tableName} RLS 狀態為:`, enabled);
      
      const { data, error } = await supabase.rpc('toggle_table_rls', {
        table_name: tableName,
        enabled: enabled
      });

      if (error) {
        console.error(`無法切換 ${tableName} 的 RLS 狀態:`, error);
        return false;
      }

      console.log(`${tableName} RLS 切換結果:`, data);
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

  /**
   * 取得表格分類
   */
  static getTablesByCategory(): Record<string, TableRLSStatus[]> {
    // 此方法將在 Hook 中實現，這裡提供分類資訊
    return {};
  }

  /**
   * 取得所有分類
   */
  static getCategories() {
    return [
      { key: 'core', name: '核心資料', icon: 'Users' },
      { key: 'organization', name: '組織架構', icon: 'Building' },
      { key: 'workflow', name: '工作流程', icon: 'Workflow' },
      { key: 'attendance', name: '考勤管理', icon: 'Clock' },
      { key: 'communication', name: '通訊資料', icon: 'MessageSquare' },
      { key: 'system', name: '系統設定', icon: 'Settings' }
    ];
  }
}
