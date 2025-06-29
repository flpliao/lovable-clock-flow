
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useFinalPermissions } from '@/hooks/useFinalPermissions';
import { RefreshCw, TrendingUp, Database, Clock } from 'lucide-react';

interface RLSStats {
  table_name: string;
  optimization_status: string;
  performance_impact: string;
}

const RLSPerformanceMonitor: React.FC = () => {
  const { toast } = useToast();
  const { isAdmin, getRLSStats, clearPermissionCache } = useFinalPermissions();
  const [stats, setStats] = useState<RLSStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 載入 RLS 效能統計
  const loadStats = async () => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "需要管理員權限才能查看 RLS 效能統計",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const data = await getRLSStats();
      setStats(data);
      console.log('✅ RLS 效能統計載入成功:', data);
    } catch (error) {
      console.error('❌ 載入 RLS 效能統計失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入 RLS 效能統計",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 刷新權限快取
  const handleRefreshCache = async () => {
    try {
      setRefreshing(true);
      await clearPermissionCache();
      
      toast({
        title: "快取刷新成功",
        description: "權限快取已成功刷新",
      });
      
      // 重新載入統計
      await loadStats();
    } catch (error) {
      console.error('❌ 刷新快取失敗:', error);
      toast({
        title: "刷新失敗",
        description: "無法刷新權限快取",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // 獲取效能影響的顏色
  const getPerformanceColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'minimal':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 獲取優化狀態的顏色
  const getOptimizationColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'optimized':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (!isAdmin()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            RLS 效能監控
          </CardTitle>
          <CardDescription>權限不足，無法查看效能統計</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              RLS 效能監控
            </CardTitle>
            <CardDescription>
              資料庫行級安全性政策效能統計和快取管理
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadStats}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              {loading ? '載入中...' : '重新載入'}
            </Button>
            <Button
              onClick={handleRefreshCache}
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? '刷新中...' : '刷新快取'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">載入效能統計中...</p>
          </div>
        ) : stats.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">暫無效能統計資料</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{stat.table_name}</h4>
                  <p className="text-sm text-gray-500 mt-1">資料表權限政策</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getOptimizationColor(stat.optimization_status)}>
                    {stat.optimization_status}
                  </Badge>
                  <Badge className={getPerformanceColor(stat.performance_impact)}>
                    {stat.performance_impact} impact
                  </Badge>
                </div>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">優化摘要</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">總表格數:</span>
                  <span className="ml-2 font-medium">{stats.length}</span>
                </div>
                <div>
                  <span className="text-blue-600">已優化:</span>
                  <span className="ml-2 font-medium">
                    {stats.filter(s => s.optimization_status === 'optimized').length}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600">低影響:</span>
                  <span className="ml-2 font-medium">
                    {stats.filter(s => s.performance_impact === 'low' || s.performance_impact === 'minimal').length}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600">快取狀態:</span>
                  <span className="ml-2 font-medium text-green-600">已啟用</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RLSPerformanceMonitor;
