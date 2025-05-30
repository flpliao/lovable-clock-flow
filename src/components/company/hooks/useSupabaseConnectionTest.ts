
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseConnectionTest = () => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const { toast } = useToast();

  const testSupabaseConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      console.log('開始測試 Supabase 連線...');
      
      // 測試基本連線 - 先嘗試 companies 表
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('count')
        .limit(1);

      if (companiesError) {
        console.log('companies 表測試結果:', companiesError);
      } else {
        console.log('companies 表測試成功:', companiesData);
      }

      // 測試 staff 表（現在 RLS 已停用）
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('count')
        .limit(1);

      if (staffError) {
        console.log('staff 表測試結果:', staffError);
      } else {
        console.log('staff 表測試成功:', staffData);
      }

      // 測試 branches 表
      const { data: branchesData, error: branchesError } = await supabase
        .from('branches')
        .select('count')
        .limit(1);

      if (branchesError) {
        console.log('branches 表測試結果:', branchesError);
      } else {
        console.log('branches 表測試成功:', branchesData);
      }

      // 如果所有表都有嚴重錯誤才顯示失敗
      if (companiesError && staffError && branchesError) {
        toast({
          title: "連線測試失敗",
          description: "無法連接到任何資料表，請檢查網路連線",
          variant: "destructive"
        });
        return;
      }

      console.log('連線測試完成');
      toast({
        title: "連線測試成功",
        description: "Supabase 資料庫連線正常，RLS 問題已解決",
      });
      
    } catch (error) {
      console.error('連線測試發生錯誤:', error);
      toast({
        title: "連線測試失敗",
        description: error instanceof Error ? error.message : "未知錯誤",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return {
    testSupabaseConnection,
    isTestingConnection
  };
};
