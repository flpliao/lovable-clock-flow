import React from 'react';
import { Clock } from 'lucide-react';
const LocationCheckInHeader = () => {
  return <div className="flex items-center justify-center space-x-2 text-white mb-4">
      <div className="p-2 bg-blue-500/80 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/50">
        <Clock className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-semibold drop-shadow-md">打卡</span>
    </div>;
};
export default LocationCheckInHeader;