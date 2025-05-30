
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
      
      // 改為測試 companies 表而不是 staff 表，避免 RLS 問題
      const { data, error } = await supabase
        .from('companies')
        .select('count')
        .limit(1);

      if (error) {
        console.error('連線測試失敗:', error);
        toast({
          title: "連線測試失敗",
          description: `無法連接到資料庫: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('連線測試成功:', data);
      toast({
        title: "連線測試成功",
        description: "Supabase 資料庫連線正常",
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
