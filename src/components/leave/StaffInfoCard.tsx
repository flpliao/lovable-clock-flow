
import React from 'react';
import { User, Building, Briefcase, CalendarDays, AlertCircle } from 'lucide-react';

interface StaffInfoCardProps {
  staffData: {
    name: string;
    department: string;
    position: string;
    hire_date: string | null;
    yearsOfService: string;
    totalAnnualLeaveDays: number;
    usedAnnualLeaveDays: number;
    remainingAnnualLeaveDays: number;
  } | null;
  isLoading: boolean;
  error?: string | null;
}

export const StaffInfoCard = React.memo(function StaffInfoCard({
  staffData,
  isLoading,
  error
}: StaffInfoCardProps) {
  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/30 rounded-lg"></div>
            <div className="h-4 bg-white/30 rounded w-24"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="h-8 bg-white/20 rounded-lg"></div>
            <div className="h-8 bg-white/20 rounded-lg"></div>
            <div className="h-8 bg-white/20 rounded-lg"></div>
            <div className="h-8 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-2 text-white">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">載入人員資料失敗: {error}</span>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="text-center text-white/70 text-sm">無法載入人員資料</div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
      {/* 簡化的標題 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <User className="h-3 w-3 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-white drop-shadow-md">人員資訊</h3>
      </div>

      {/* 緊湊的網格佈局 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="bg-violet-400/80 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <User className="h-3 w-3 text-white/80" />
            <span className="text-white/70 font-medium">姓名</span>
          </div>
          <p className="text-white font-semibold text-sm">{staffData.name}</p>
        </div>

        <div className="bg-amber-400/80 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Building className="h-3 w-3 text-white/80" />
            <span className="text-white/70 font-medium">部門</span>
          </div>
          <p className="text-white font-semibold text-sm">{staffData.department}</p>
        </div>

        <div className="bg-teal-400/80 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Briefcase className="h-3 w-3 text-white/80" />
            <span className="text-white/70 font-medium">職位</span>
          </div>
          <p className="text-white font-semibold text-sm">{staffData.position}</p>
        </div>

        <div className="bg-green-400/80 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CalendarDays className="h-3 w-3 text-white/80" />
            <span className="text-white/70 font-medium">年資</span>
          </div>
          <p className="text-white font-semibold text-sm">{staffData.yearsOfService}</p>
        </div>
      </div>
    </div>
  );
});
