
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RefreshCw, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RLSOptimizationData {
  table_name: string;
  optimization_status: string;
  performance_impact: string;
}

interface PerformanceStats {
  optimized_policies: number;
  remaining_auth_uid_calls: number;
  performance_improvement_estimate: string;
}

const RLSOptimizationReport: React.FC = () => {
  const [optimizationData, setOptimizationData] = useState<RLSOptimizationData[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOptimizationReport = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 載入 RLS 優化報告...');

      // 載入優化狀態
      const { data: rlsData, error: rlsError } = await supabase
        .from('rls_performance_summary')
        .select('*');

      if (rlsError) {
        console.error('❌ 載入 RLS 優化狀態失敗:', rlsError);
      } else {
        setOptimizationData(rlsData || []);
        console.log('✅ RLS 優化狀態載入成功:', rlsData?.length || 0, '筆');
      }

      // 載入效能統計
      const { data: statsData, error: statsError } = await supabase
        .rpc('refresh_rls_performance_stats');

      if (statsError) {
        console.error('❌ 載入效能統計失敗:', statsError);
      } else if (statsData && statsData.length > 0) {
        setPerformanceStats(statsData[0]);
        console.log('✅ 效能統計載入成功:', statsData[0]);
      }

    } catch (error) {
      console.error('❌ 載入優化報告時發生錯誤:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOptimizationReport();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('implemented') || status.includes('Optimized')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          RLS 效能優化報告
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={loadOptimizationReport}
          disabled={isLoading}
          className="h-8 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 效能統計摘要 */}
        {performanceStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{performanceStats.optimized_policies}</p>
              <p className="text-xs text-muted-foreground">已優化政策</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{performanceStats.remaining_auth_uid_calls}</p>
              <p className="text-xs text-muted-foreground">剩餘 auth.uid() 調用</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-blue-600">{performanceStats.performance_improvement_estimate}</p>
              <p className="text-xs text-muted-foreground">預期效能提升</p>
            </div>
          </div>
        )}

        {/* 優化狀態列表 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">資料表優化狀態</h4>
          {optimizationData.length > 0 ? (
            optimizationData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.optimization_status)}
                  <div>
                    <p className="font-medium text-sm">{item.table_name}</p>
                    <p className="text-xs text-muted-foreground">{item.optimization_status}</p>
                  </div>
                </div>
                <Badge className={`${getImpactColor(item.performance_impact)} text-white text-xs`}>
                  {item.performance_impact} Impact
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>載入優化狀態中...</p>
            </div>
          )}
        </div>

        {/* 優化建議 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">🎯 優化重點摘要</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 使用 JOIN-based RLS policies 替代 auth.uid() 直接調用</li>
            <li>• 建立 SECURITY DEFINER 函數來快取權限檢查</li>
            <li>• 添加關鍵索引以加速 EXISTS 子查詢</li>
            <li>• 減少 PostgreSQL 查詢初始化成本</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground">
          最後更新：{new Date().toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default RLSOptimizationReport;
