
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface ScheduleListLoadingStateProps {
  title: string;
}

const ScheduleListLoadingState: React.FC<ScheduleListLoadingStateProps> = ({ title }) => {
  return (
    <div className="text-center py-12">
      <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
      <p className="text-white/80 font-medium drop-shadow-md text-lg">正在載入{title}...</p>
    </div>
  );
};

export default ScheduleListLoadingState;
