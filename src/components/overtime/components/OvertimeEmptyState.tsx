
import React from 'react';
import { FileText } from 'lucide-react';

const OvertimeEmptyState: React.FC = () => {
  return (
    <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-8">
      <div className="text-center text-white/70">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg">沒有找到相關的加班記錄</p>
      </div>
    </div>
  );
};

export default OvertimeEmptyState;
