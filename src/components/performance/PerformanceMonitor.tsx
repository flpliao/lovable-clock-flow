
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, Zap, Clock, TrendingUp, Activity } from 'lucide-react';
import { visionProStyles } from '@/utils/visionProStyles';

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
    if (avgTime < 20) return { label: '優秀', color: 'bg-green-500/90 text-white border-green-400/50' };
    if (avgTime < 50) return { label: '良好', color: 'bg-yellow-500/90 text-white border-yellow-400/50' };
    return { label: '需要優化', color: 'bg-red-500/90 text-white border-red-400/50' };
  };

  const performanceStatus = getPerformanceStatus(metrics.averageQueryTime);

  return (
    <div className="h-full">
      <div className="p-6">
        {/* 標題區域 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={visionProStyles.coloredIconContainer.blue}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">RLS 效能監控</h3>
              <p className="text-sm text-gray-600 font-medium">即時資料庫效能指標</p>
            </div>
          </div>
          <Button
            onClick={refreshMetrics}
            disabled={isRefreshing}
            size="sm"
            className="bg-white/60 hover:bg-white/80 text-gray-900 border border-white/40 backdrop-blur-xl shadow-lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '更新中' : '刷新'}
          </Button>
        </div>

        {/* 效能指標卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/40 rounded-xl p-4 backdrop-blur-xl border border-white/50 hover:bg-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={visionProStyles.coloredIconContainer.green}>
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">查詢次數</p>
                <p className="text-xl font-bold text-gray-900">{metrics.queryCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/40 rounded-xl p-4 backdrop-blur-xl border border-white/50 hover:bg-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={visionProStyles.coloredIconContainer.orange}>
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 font-medium">平均查詢時間</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl font-bold text-gray-900">{metrics.averageQueryTime}ms</p>
                  <Badge className={`text-xs ${performanceStatus.color} shadow-lg backdrop-blur-xl`}>
                    {performanceStatus.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/40 rounded-xl p-4 backdrop-blur-xl border border-white/50 hover:bg-white/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={visionProStyles.coloredIconContainer.purple}>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">緩存命中率</p>
                <p className="text-xl font-bold text-gray-900">{metrics.cacheHitRate}%</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 最後更新時間 */}
        <div className="text-xs text-gray-600 font-medium mb-6">
          最後更新：{metrics.lastUpdated}
        </div>
        
        {/* RLS 優化狀態 */}
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-white/30">
          <div className="flex items-start gap-3">
            <div className={visionProStyles.coloredIconContainer.green}>
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-green-700 mb-2">✅ RLS 優化已啟用</p>
              <ul className="text-xs space-y-1 text-gray-700 font-medium">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  使用優化後的 EXISTS 條件替代函數調用
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  建立關鍵索引以加速權限查詢
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  啟用用戶權限材化視圖緩存
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  減少 auth.uid() 調用次數
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
