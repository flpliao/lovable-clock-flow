
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import RLSOptimizationReport from '@/components/performance/RLSOptimizationReport';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import { TrendingUp, Database, Shield } from 'lucide-react';

const PerformanceMonitoringPage = () => {
  const { isAdmin } = useUser();

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2 text-white">無權限訪問</h2>
        <p className="text-white/70 font-medium drop-shadow-md">您沒有權限訪問效能監控功能</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-md">系統效能監控</h1>
            <p className="text-white/80 text-lg mt-1">即時監控資料庫效能和 RLS 政策優化狀況</p>
          </div>
        </div>

        {/* 監控重點說明 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-xl border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <Database className="h-5 w-5 text-blue-400" />
              <h3 className="font-semibold text-white">查詢效能</h3>
            </div>
            <p className="text-white/80 text-sm">監控資料庫查詢速度和緩存命中率</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-xl border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-green-400" />
              <h3 className="font-semibold text-white">RLS 優化</h3>
            </div>
            <p className="text-white/80 text-sm">追蹤行級安全性政策優化狀況</p>
          </div>
          
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-xl border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-white">效能提升</h3>
            </div>
            <p className="text-white/80 text-sm">評估系統整體效能改善程度</p>
          </div>
        </div>
      </div>

      {/* 效能監控組件 */}
      <div className="space-y-6">
        <PerformanceMonitor />
        <RLSOptimizationReport />
      </div>

      {/* 監控建議 */}
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">📊 監控建議</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/20 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">🎯 定期檢查項目</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• 每日檢查平均查詢時間</li>
              <li>• 監控緩存命中率變化</li>
              <li>• 觀察 RLS 政策效能影響</li>
              <li>• 留意異常查詢模式</li>
            </ul>
          </div>
          
          <div className="bg-white/20 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-2">⚡ 效能優化提醒</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• 平均查詢時間 &gt; 50ms 需要注意</li>
              <li>• 緩存命中率 &lt; 70% 需要優化</li>
              <li>• 定期更新資料庫統計信息</li>
              <li>• 監控高頻查詢的索引使用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoringPage;
