
import React from 'react';
import { Calendar, Clock, Timer } from 'lucide-react';

interface OvertimeTimeInfoProps {
  overtimeDate: string;
  startTime: string;
  endTime: string;
  hours: number;
}

const OvertimeTimeInfo: React.FC<OvertimeTimeInfoProps> = ({
  overtimeDate,
  startTime,
  endTime,
  hours
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-white/90" />
        <h4 className="text-base font-medium text-white">時間資訊</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-white/80" />
          <div>
            <span className="text-white/70">日期:</span>
            <p className="font-medium text-white">{overtimeDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-white/80" />
          <div>
            <span className="text-white/70">時間:</span>
            <p className="font-medium text-white">
              {new Date(startTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(endTime).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Timer className="h-4 w-4 text-white/80" />
          <div>
            <span className="text-white/70">時數:</span>
            <p className="font-bold text-purple-200">{hours} 小時</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeTimeInfo;
