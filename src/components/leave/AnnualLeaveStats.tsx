
import React from 'react';

interface AnnualLeaveStatsProps {
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export function AnnualLeaveStats({ totalDays, usedDays, remainingDays }: AnnualLeaveStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 總天數 */}
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-300/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-white mb-1">{totalDays}</div>
        <div className="text-blue-100 text-sm font-medium">年度總額（天）</div>
        <div className="text-blue-200/80 text-xs mt-1">{totalDays * 8} 小時</div>
      </div>

      {/* 已使用天數 */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-white mb-1">{usedDays}</div>
        <div className="text-orange-100 text-sm font-medium">已使用（天）</div>
        <div className="text-orange-200/80 text-xs mt-1">{usedDays * 8} 小時</div>
      </div>

      {/* 剩餘天數 */}
      <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-300/30 rounded-2xl p-4 text-center">
        <div className="text-3xl font-bold text-white mb-1">{remainingDays}</div>
        <div className="text-green-100 text-sm font-medium">剩餘可用（天）</div>
        <div className="text-green-200/80 text-xs mt-1">{remainingDays * 8} 小時</div>
      </div>
    </div>
  );
}
