
import { useState, useEffect } from 'react';
import { RLSSettingsService, TableRLSStatus } from '../services/rlsSettingsService';
import { useToast } from '@/hooks/use-toast';

export const useRLSSettings = () => {
  const [isGlobalRLSEnabled, setIsGlobalRLSEnabled] = useState(false);
  const [tableRLSStatus, setTableRLSStatus] = useState<TableRLSStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 載入所有 RLS 設定
  const loadAllRLSSettings = async () => {
    setLoading(true);
    try {
      const [globalStatus, tableStatuses] = await Promise.all([
        RLSSettingsService.getRLSStatus(),
        RLSSettingsService.getAllTableRLSStatus()
      ]);
      
      setIsGlobalRLSEnabled(globalStatus);
      setTableRLSStatus(tableStatuses);
    } catch (error) {
      console.error('載入 RLS 設定失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入 RLS 安全設定",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 切換全域 RLS 設定
  const toggleGlobalRLS = async () => {
    const newStatus = !isGlobalRLSEnabled;
    
    try {
      const success = await RLSSettingsService.applyGlobalRLSSettings(newStatus);
      
      if (success) {
        setIsGlobalRLSEnabled(newStatus);
        toast({
          title: "全域設定更新成功",
          description: `全域 RLS 安全政策已${newStatus ? '開啟' : '關閉'}`,
        });
      } else {
        toast({
          title: "全域設定更新失敗",
          description: "無法更新全域 RLS 安全設定",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('切換全域 RLS 設定失敗:', error);
      toast({
        title: "操作失敗",
        description: "切換全域 RLS 設定時發生錯誤",
        variant: "destructive"
      });
    }
  };

  // 切換特定表格的 RLS 設定
  const toggleTableRLS = async (tableName: string) => {
    const currentTable = tableRLSStatus.find(t => t.tableName === tableName);
    if (!currentTable) return;

    const newStatus = !currentTable.enabled;
    
    try {
      const success = await RLSSettingsService.toggleTableRLS(tableName, newStatus);
      
      if (success) {
        setTableRLSStatus(prev => 
          prev.map(table => 
            table.tableName === tableName 
              ? { ...table, enabled: newStatus }
              : table
          )
        );
        
        toast({
          title: "表格設定更新成功",
          description: `${currentTable.displayName} RLS 政策已${newStatus ? '開啟' : '關閉'}`,
        });
      } else {
        toast({
          title: "表格設定更新失敗",
          description: `無法更新 ${currentTable.displayName} 的 RLS 設定`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`切換 ${tableName} RLS 設定失敗:`, error);
      toast({
        title: "操作失敗",
        description: `切換 ${currentTable.displayName} RLS 設定時發生錯誤`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadAllRLSSettings();
  }, []);

  return {
    // 全域設定
    isGlobalRLSEnabled,
    toggleGlobalRLS,
    
    // 表格級別設定
    tableRLSStatus,
    toggleTableRLS,
    
    // 通用
    loading,
    loadAllRLSSettings
  };
};
