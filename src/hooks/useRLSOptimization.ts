
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RLSOptimizationHook {
  checkOptimizationStatus: () => Promise<void>;
  validatePolicyPerformance: () => Promise<void>;
  isLoading: boolean;
  optimizationResults: any[];
}

export const useRLSOptimization = (): RLSOptimizationHook => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);

  const checkOptimizationStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔍 檢查 RLS 優化狀態...');
      
      // 檢查各表的 RLS policy 優化狀態
      const { data, error } = await supabase
        .from('rls_performance_summary')
        .select('*');

      if (error) {
        console.error('❌ 檢查優化狀態失敗:', error);
        toast({
          title: "檢查失敗",
          description: "無法載入 RLS 優化狀態",
          variant: "destructive"
        });
        return;
      }

      setOptimizationResults(data || []);
      console.log('✅ RLS 優化狀態檢查完成:', data?.length || 0, '個資料表');
      
      toast({
        title: "檢查完成",
        description: `已檢查 ${data?.length || 0} 個資料表的優化狀態`,
      });
      
    } catch (error) {
      console.error('❌ 檢查優化狀態時發生錯誤:', error);
      toast({
        title: "檢查失敗",
        description: "檢查過程中發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const validatePolicyPerformance = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔍 驗證 RLS policy 效能...');
      
      // 調用效能統計函數
      const { data, error } = await supabase
        .rpc('refresh_rls_performance_stats');

      if (error) {
        console.error('❌ 驗證效能失敗:', error);
        toast({
          title: "驗證失敗",
          description: "無法驗證 RLS policy 效能",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ RLS policy 效能驗證完成:', data);
      
      if (data && data.length > 0) {
        const stats = data[0];
        toast({
          title: "效能驗證完成",
          description: `已優化 ${stats.optimized_policies} 個政策，${stats.performance_improvement_estimate}`,
        });
      }
      
    } catch (error) {
      console.error('❌ 驗證效能時發生錯誤:', error);
      toast({
        title: "驗證失敗",
        description: "驗證過程中發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    checkOptimizationStatus,
    validatePolicyPerformance,
    isLoading,
    optimizationResults
  };
};
