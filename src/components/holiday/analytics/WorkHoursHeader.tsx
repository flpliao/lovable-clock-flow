
import React from 'react';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const WorkHoursHeader: React.FC = () => {
  return (
    <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white drop-shadow-md">工時統計分析</h3>
            <p className="text-white/80 text-sm mt-1">分析年度工作時數與假日分布</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="p-2 bg-blue-500/60 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/40">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div className="p-2 bg-purple-500/60 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/40">
            <PieChartIcon className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkHoursHeader;
