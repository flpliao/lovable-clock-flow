
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Zap, Clock } from 'lucide-react';

interface PerformanceMetrics {
  queryCount: number;
  averageQueryTime: number;
  cacheHitRate: number;
  lastUpdated: string;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    queryCount: 0,
    averageQueryTime: 0,
    cacheHitRate: 0,
    lastUpdated: new Date().toLocaleString()
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模擬效能監控數據
  const refreshMetrics = async () => {
    setIsRefreshing(true);
    
    // 模擬 API 調用延遲
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMetrics({
      queryCount: Math.floor(Math.random() * 100) + 50,
      averageQueryTime: Math.floor(Math.random() * 50) + 10, // ms
      cacheHitRate: Math.floor(Math.random() * 30) + 70, // %
      lastUpdated: new Date().toLocaleString()
    });
    
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshMetrics();
  }, []);

  const getPerformanceStatus = (avgTime: number) => {
    if (avgTime < 20) return { label: '優秀', color: 'bg-green-500' };
    if (avgTime < 50) return { label: '良好', color: 'bg-yellow-500' };
    return { label: '需要優化', color: 'bg-red-500' };
  };

  const performanceStatus = getPerformanceStatus(metrics.averageQueryTime);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          RLS 效能監控
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshMetrics}
          disabled={isRefreshing}
          className="h-8 px-2"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">查詢次數</p>
              <p className="text-lg font-semibold">{metrics.queryCount}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">平均查詢時間</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{metrics.averageQueryTime}ms</p>
                <Badge className={`${performanceStatus.color} text-white text-xs`}>
                  {performanceStatus.label}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">緩存命中率</p>
              <p className="text-lg font-semibold">{metrics.cacheHitRate}%</p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          最後更新：{metrics.lastUpdated}
        </div>
        
        <div className="bg-muted p-3 rounded-lg text-sm">
          <p className="font-medium text-green-600 mb-1">✅ RLS 優化已啟用</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• 使用優化後的 EXISTS 條件替代函數調用</li>
            <li>• 建立關鍵索引以加速權限查詢</li>
            <li>• 啟用用戶權限材化視圖緩存</li>
            <li>• 減少 auth.uid() 調用次數</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
