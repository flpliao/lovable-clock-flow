
import React from 'react';
import { CalendarDays } from 'lucide-react';

interface AnnualLeaveBalanceHeaderProps {
  title: string;
  subtitle: string;
  variant?: 'default' | 'warning';
}

export function AnnualLeaveBalanceHeader({ 
  title, 
  subtitle, 
  variant = 'default' 
}: AnnualLeaveBalanceHeaderProps) {
  const iconBg = variant === 'warning' 
    ? 'bg-gradient-to-br from-yellow-500 to-orange-600'
    : 'bg-gradient-to-br from-blue-500 to-purple-600';

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
        <CalendarDays className="h-5 w-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white drop-shadow-md">{title}</h3>
        <p className="text-sm text-white/80 font-medium drop-shadow-sm">{subtitle}</p>
      </div>
    </div>
  );
}
