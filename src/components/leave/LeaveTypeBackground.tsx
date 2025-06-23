
import React from 'react';

export function LeaveTypeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-400/15 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-slate-400/25 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
    </div>
  );
}
