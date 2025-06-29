
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Shield, CheckCircle, AlertCircle, Database, TrendingUp } from 'lucide-react';
import { visionProStyles } from '@/utils/visionProStyles';

interface OptimizationData {
  table_name: string;
  optimization_status: 'optimized' | 'partial' | 'pending';
  performance_impact: 'minimal' | 'low' | 'medium' | 'high';
  last_analyzed: string;
}

const RLSOptimizationReport: React.FC = () => {
  const { toast } = useToast();
  const [optimizationData, setOptimizationData] = useState<OptimizationData[]>([]);
  const [loading, setLoading] = useState(false);

  // 模擬資料載入
  const loadOptimizationData = async () => {
    setLoading(true);
    
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: OptimizationData[] = [
      {
        table_name: 'staff',
        optimization_status: 'optimized',
        performance_impact: 'minimal',
        last_analyzed: new Date().toLocaleString()
      },
      {
        table_name: 'leave_requests',
        optimization_status: 'optimized',
        performance_impact: 'low',
        last_analyzed: new Date().toLocaleString()
      },
      {
        table_name: 'departments',
        optimization_status: 'partial',
        performance_impact: 'medium',
        last_analyzed: new Date().toLocaleString()
      },
      {
        table_name: 'check_in_records',
        optimization_status: 'optimized',
        performance_impact: 'minimal',
        last_analyzed: new Date().toLocaleString()
      }
    ];
    
    setOptimizationData(mockData);
    setLoading(false);
    
    toast({
      title: "資料載入完成",
      description: "RLS 優化報告已更新",
    });
  };

  useEffect(() => {
    loadOptimizationData();
  }, []);

  // 獲取狀態顏色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized':
        return 'bg-green-500/90 text-white border-green-400/50';
      case 'partial':
        return 'bg-yellow-500/90 text-white border-yellow-400/50';
      case 'pending':
        return 'bg-red-500/90 text-white border-red-400/50';
      default:
        return 'bg-gray-500/90 text-white border-gray-400/50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'minimal':
        return 'bg-green-100/80 text-green-800 border-green-200/50';
      case 'low':
        return 'bg-blue-100/80 text-blue-800 border-blue-200/50';
      case 'medium':
        return 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50';
      case 'high':
        return 'bg-red-100/80 text-red-800 border-red-200/50';
      default:
        return 'bg-gray-100/80 text-gray-800 border-gray-200/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Database className="h-4 w-4 text-gray-500" />;
    }
  };

  // 計算統計數據
  const optimizedCount = optimizationData.filter(item => item.optimization_status === 'optimized').length;
  const lowImpactCount = optimizationData.filter(item => 
    item.performance_impact === 'minimal' || item.performance_impact === 'low'
  ).length;

  return (
    <div className="h-full">
      <div className="p-6">
        {/* 標題區域 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={visionProStyles.coloredIconContainer.purple}>
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">RLS 優化報告</h3>
              <p className="text-sm text-gray-600 font-medium">資料表安全政策優化狀況</p>
            </div>
          </div>
          <Button
            onClick={loadOptimizationData}
            disabled={loading}
            size="sm"
            className="bg-white/60 hover:bg-white/80 text-gray-900 border border-white/40 backdrop-blur-xl shadow-lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '分析中' : '重新分析'}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">正在分析 RLS 優化狀況...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 資料表優化狀況 */}
            {optimizationData.map((item, index) => (
              <div key={index} className="bg-white/40 rounded-xl p-4 backdrop-blur-xl border border-white/50 hover:bg-white/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.optimization_status)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.table_name}</h4>
                      <p className="text-xs text-gray-600 font-medium">資料表權限政策</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs shadow-lg backdrop-blur-xl ${getStatusColor(item.optimization_status)}`}>
                      {item.optimization_status === 'optimized' ? '已優化' : 
                       item.optimization_status === 'partial' ? '部分優化' : '待優化'}
                    </Badge>
                    <Badge className={`text-xs shadow-lg backdrop-blur-xl ${getImpactColor(item.performance_impact)}`}>
                      {item.performance_impact === 'minimal' ? '極低影響' :
                       item.performance_impact === 'low' ? '低影響' :
                       item.performance_impact === 'medium' ? '中等影響' : '高影響'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 優化統計摘要 */}
            <div className="bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-xl p-5 border border-white/30 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={visionProStyles.coloredIconContainer.teal}>
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h4 className="font-semibold text-gray-900">優化統計摘要</h4>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{optimizationData.length}</div>
                  <div className="text-gray-700">總表格數</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{optimizedCount}</div>
                  <div className="text-gray-700">已優化</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600 mb-1">{lowImpactCount}</div>
                  <div className="text-gray-700">低影響</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">啟用</div>
                  <div className="text-gray-700">快取狀態</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RLSOptimizationReport;
