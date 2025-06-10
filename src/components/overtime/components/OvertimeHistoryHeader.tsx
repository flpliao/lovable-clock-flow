
import React from 'react';
import { Search, History, Clock } from 'lucide-react';

const OvertimeHistoryHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
          <History className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white drop-shadow-md">加班記錄查詢</h3>
          <p className="text-white/80 text-sm mt-1">搜尋和篩選您的加班記錄</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <div className="p-2 bg-blue-500/60 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/40">
          <Search className="h-4 w-4 text-white" />
        </div>
        <div className="p-2 bg-purple-500/60 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/40">
          <Clock className="h-4 w-4 text-white" />
        </div>
      </div>
    </div>
  );
};

export default OvertimeHistoryHeader;
