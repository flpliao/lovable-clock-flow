
import React from 'react';
import { FileText, Search, Clock } from 'lucide-react';

const OvertimeEmptyState: React.FC = () => {
  return (
    <div className="backdrop-blur-2xl bg-white/15 border border-white/30 rounded-3xl shadow-2xl p-12">
      <div className="text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="p-4 bg-gray-500/60 rounded-xl shadow-lg backdrop-blur-xl border border-gray-400/40">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div className="p-4 bg-blue-500/60 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/40">
            <Search className="h-8 w-8 text-white" />
          </div>
          <div className="p-4 bg-purple-500/60 rounded-xl shadow-lg backdrop-blur-xl border border-purple-400/40">
            <Clock className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3">沒有找到相關的加班記錄</h3>
        <div className="space-y-2 text-white/70">
          <p className="flex items-center justify-center gap-2">
            <Search className="h-4 w-4" />
            嘗試調整搜尋條件或篩選器
          </p>
          <p className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            或者您還沒有提交任何加班申請
          </p>
        </div>
      </div>
    </div>
  );
};

export default OvertimeEmptyState;
