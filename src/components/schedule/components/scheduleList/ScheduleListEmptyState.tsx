
import React from 'react';
import { Clock } from 'lucide-react';

interface ScheduleListEmptyStateProps {
  title: string;
}

const ScheduleListEmptyState: React.FC<ScheduleListEmptyStateProps> = ({ title }) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
        <Clock className="w-10 h-10 text-white/60" />
      </div>
      <p className="text-white/80 font-semibold text-lg drop-shadow-md">沒有找到任何{title}</p>
      <p className="text-white/60 mt-2 drop-shadow-md">請確認已經完成排班，或嘗試重新載入</p>
    </div>
  );
};

export default ScheduleListEmptyState;
