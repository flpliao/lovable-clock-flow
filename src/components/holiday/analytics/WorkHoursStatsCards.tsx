
import React from 'react';
import { Calendar, MapPin, Clock, Timer } from 'lucide-react';

interface WorkHoursStatsCardsProps {
  totalWorkDays: number;
  totalHolidays: number;
  totalWorkHours: number;
  averageMonthlyHours: number;
}

const WorkHoursStatsCards: React.FC<WorkHoursStatsCardsProps> = ({
  totalWorkDays,
  totalHolidays,
  totalWorkHours,
  averageMonthlyHours
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/70 rounded-lg shadow-md">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <span className="text-white/80 text-sm">工作日</span>
        </div>
        <div className="text-2xl font-bold text-white">{totalWorkDays}</div>
        <div className="text-white/70 text-xs">年度工作日</div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-500/70 rounded-lg shadow-md">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <span className="text-white/80 text-sm">假日</span>
        </div>
        <div className="text-2xl font-bold text-white">{totalHolidays}</div>
        <div className="text-white/70 text-xs">法定假日</div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/70 rounded-lg shadow-md">
            <Clock className="h-4 w-4 text-white" />
          </div>
          <span className="text-white/80 text-sm">工時</span>
        </div>
        <div className="text-2xl font-bold text-white">{totalWorkHours}</div>
        <div className="text-white/70 text-xs">年度工時</div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-500/70 rounded-lg shadow-md">
            <Timer className="h-4 w-4 text-white" />
          </div>
          <span className="text-white/80 text-sm">平均</span>
        </div>
        <div className="text-2xl font-bold text-white">{averageMonthlyHours}</div>
        <div className="text-white/70 text-xs">月均工時</div>
      </div>
    </div>
  );
};

export default WorkHoursStatsCards;
