
import React from 'react';
import { Clock } from 'lucide-react';

interface AnnualLeaveProgressBarProps {
  usedDays: number;
  totalDays: number;
  usagePercentage: number;
}

export function AnnualLeaveProgressBar({ usedDays, totalDays, usagePercentage }: AnnualLeaveProgressBarProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-white/80" />
          <span className="text-white font-medium">使用進度</span>
        </div>
        <span className="text-white font-bold text-lg">{usagePercentage}%</span>
      </div>
      
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out shadow-lg" 
          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
        />
      </div>
      
      {/* 進度條標籤 */}
      <div className="flex justify-between mt-2 text-xs text-white/70">
        <span>{usedDays} 天</span>
        <span>{totalDays} 天</span>
      </div>
    </div>
  );
}
