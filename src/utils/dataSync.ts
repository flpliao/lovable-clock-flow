
import { supabase, ensureUserAuthenticated } from '@/integrations/supabase/client';

interface SyncResult {
  connectionStatus: boolean;
  staffData: any[];
  departmentData: any[];
  lastSync: string;
}

export class DataSyncManager {
  // 檢查後台連線狀態
  static async checkBackendConnection(): Promise<boolean> {
    try {
      console.log('🔍 檢查 Supabase 後台連線狀態...');
      
      // 確保用戶認證
      await ensureUserAuthenticated();
      
      // 簡單查詢測試連線
      const { data, error } = await supabase
        .from('staff')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ 後台連線測試失敗:', error);
        return false;
      }

      console.log('✅ 後台連線正常');
      return true;
    } catch (error) {
      console.error('❌ 連線檢查異常:', error);
      return false;
    }
  }

  // 執行完整資料同步
  static async performFullSync(): Promise<SyncResult> {
    console.log('🔄 開始執行完整資料同步...');
    
    const syncResult: SyncResult = {
      connectionStatus: false,
      staffData: [],
      departmentData: [],
      lastSync: new Date().toISOString()
    };

    try {
      // 檢查連線
      const isConnected = await this.checkBackendConnection();
      syncResult.connectionStatus = isConnected;

      if (!isConnected) {
        console.warn('⚠️ 後台連線失敗，跳過資料同步');
        return syncResult;
      }

      // 同步員工資料
      console.log('📋 同步員工資料...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (staffError) {
        console.error('❌ 員工資料同步失敗:', staffError);
      } else {
        syncResult.staffData = staffData || [];
        console.log('✅ 員工資料同步完成，筆數:', syncResult.staffData.length);
      }

      // 同步部門資料
      console.log('🏢 同步部門資料...');
      const { data: departmentData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (deptError) {
        console.error('❌ 部門資料同步失敗:', deptError);
      } else {
        syncResult.departmentData = departmentData || [];
        console.log('✅ 部門資料同步完成，筆數:', syncResult.departmentData.length);
      }

      console.log('✅ 完整資料同步完成');
      return syncResult;

    } catch (error) {
      console.error('❌ 資料同步系統錯誤:', error);
      return syncResult;
    }
  }
}
