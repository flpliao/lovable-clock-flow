
import React from 'react';

interface AnnualLeaveWarningsProps {
  remainingDays: number;
}

export function AnnualLeaveWarnings({ remainingDays }: AnnualLeaveWarningsProps) {
  if (remainingDays > 2) {
    return null;
  }

  if (remainingDays <= 0) {
    return (
      <div className="mt-4 bg-red-500/20 border border-red-300/30 rounded-xl p-3">
        <div className="flex items-center gap-2 text-red-100">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-sm font-medium">特休已用完，無法申請更多特別休假</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-3">
      <div className="flex items-center gap-2 text-yellow-100">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">特休餘額即將用完，請合理安排休假時間</span>
      </div>
    </div>
  );
}
