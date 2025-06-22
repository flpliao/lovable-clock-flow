
import React from 'react';

export function AnnualLeaveLoadingState() {
  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
          <div className="h-6 bg-white/30 rounded w-32"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-20 bg-white/20 rounded-xl"></div>
          <div className="h-20 bg-white/20 rounded-xl"></div>
          <div className="h-20 bg-white/20 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
