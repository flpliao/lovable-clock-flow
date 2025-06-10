
import React from 'react';
import { Search } from 'lucide-react';

const OvertimeHistoryHeader: React.FC = () => {
  return (
    <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
          <Search className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white drop-shadow-md">搜尋篩選</h3>
      </div>
    </div>
  );
};

export default OvertimeHistoryHeader;
