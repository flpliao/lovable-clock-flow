
import React from 'react';
import { Clock } from 'lucide-react';

const OvertimeFormHeader: React.FC = () => {
  return (
    <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-6 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white drop-shadow-md">加班申請表</h3>
      </div>
    </div>
  );
};

export default OvertimeFormHeader;
