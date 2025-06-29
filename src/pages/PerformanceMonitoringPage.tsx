
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import RLSOptimizationReport from '@/components/performance/RLSOptimizationReport';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { TrendingUp, Database, Shield, Activity, BarChart3, Zap } from 'lucide-react';
import { visionProStyles } from '@/utils/visionProStyles';

const PerformanceMonitoringPage = () => {
  const { isAdmin } = useUser();

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden p-6">
        <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-8 text-center max-w-md mx-auto mt-20">
          <Shield className="h-12 w-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2 text-gray-900">無權限訪問</h2>
          <p className="text-gray-700 font-medium">您沒有權限訪問效能監控功能</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden">
      {/* 背景裝飾元素 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float"></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"></div>

      <div className="relative z-10 p-6 space-y-6">
        {/* 頁面標題區域 */}
        <div className={visionProStyles.liquidGlassCardWithGlow}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={visionProStyles.coloredIconContainer.blue}>
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm">系統效能監控</h1>
                <p className="text-gray-700 text-lg mt-1 font-medium">即時監控資料庫效能和 RLS 政策優化狀況</p>
              </div>
            </div>

            {/* 監控功能簡介卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={visionProStyles.coloredIconContainer.green}>
                    <Database className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900">查詢效能</h3>
                </div>
                <p className="text-gray-700 text-sm font-medium">監控資料庫查詢速度和緩存命中率</p>
              </div>
              
              <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={visionProStyles.coloredIconContainer.purple}>
                    <Shield className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900">RLS 優化</h3>
                </div>
                <p className="text-gray-700 text-sm font-medium">追蹤行級安全性政策優化狀況</p>
              </div>
              
              <div className="bg-white/30 rounded-xl p-4 backdrop-blur-xl border border-white/40 hover:bg-white/40 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className={visionProStyles.coloredIconContainer.orange}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900">效能提升</h3>
                </div>
                <p className="text-gray-700 text-sm font-medium">評估系統整體效能改善程度</p>
              </div>
            </div>
          </div>
        </div>

        {/* 效能監控組件區域 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={visionProStyles.liquidGlassCard}>
            <PerformanceMonitor />
          </div>
          
          <div className={visionProStyles.liquidGlassCard}>
            <RLSOptimizationReport />
          </div>
        </div>

        {/* 監控建議區域 */}
        <div className={visionProStyles.liquidGlassCard}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={visionProStyles.coloredIconContainer.teal}>
                <BarChart3 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">監控建議與最佳實務</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/30 rounded-xl p-5 backdrop-blur-xl border border-white/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className={visionProStyles.coloredIconContainer.blue}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900">定期檢查項目</h3>
                </div>
                <ul className="text-gray-700 text-sm space-y-2 font-medium">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    每日檢查平均查詢時間
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    監控緩存命中率變化
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    觀察 RLS 政策效能影響
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    留意異常查詢模式
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/30 rounded-xl p-5 backdrop-blur-xl border border-white/40">
                <div className="flex items-center gap-3 mb-4">
                  <div className={visionProStyles.coloredIconContainer.red}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900">效能優化提醒</h3>
                </div>
                <ul className="text-gray-700 text-sm space-y-2 font-medium">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    平均查詢時間 &gt; 50ms 需要注意
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    緩存命中率 &lt; 70% 需要優化
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    定期更新資料庫統計信息
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    監控高頻查詢的索引使用
                  </li>
                </ul>
              </div>
            </div>

            {/* 效能指標說明 */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/30">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                效能指標說明
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-medium">
                <div>
                  <span className="text-green-600 font-semibold">優秀:</span>
                  <span className="ml-2 text-gray-700">查詢時間 &lt; 20ms</span>
                </div>
                <div>
                  <span className="text-yellow-600 font-semibold">良好:</span>
                  <span className="ml-2 text-gray-700">查詢時間 20-50ms</span>
                </div>
                <div>
                  <span className="text-red-600 font-semibold">需優化:</span>
                  <span className="ml-2 text-gray-700">查詢時間 &gt; 50ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoringPage;
