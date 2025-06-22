import React from 'react';
import { User, CalendarDays, Building, Briefcase } from 'lucide-react';
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
}
export const StaffInfoCard = React.memo(function StaffInfoCard({
  staffData,
  isLoading
}: StaffInfoCardProps) {
  if (isLoading) {
    return <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
            <div className="h-6 bg-white/30 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-16 bg-white/20 rounded-xl"></div>
            <div className="h-16 bg-white/20 rounded-xl"></div>
          </div>
        </div>
      </div>;
  }
  if (!staffData) {
    return <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center text-white/70">無法載入人員資料</div>
      </div>;
  }
  return <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      {/* 卡片標題 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">人員資訊</h3>
          <p className="text-sm text-white/80 font-medium drop-shadow-sm">Staff Information</p>
        </div>
      </div>

      {/* 基本資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4 bg-violet-400">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-white/80" />
            <span className="text-sm text-white/70 font-medium">員工姓名</span>
          </div>
          <p className="text-white font-semibold text-lg">{staffData.name}</p>
        </div>

        <div className="rounded-2xl p-4 bg-amber-400">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-white/80" />
            <span className="text-sm text-white/70 font-medium">部門</span>
          </div>
          <p className="text-white font-semibold">{staffData.department}</p>
        </div>

        <div className="rounded-2xl p-4 bg-teal-300">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-white/80" />
            <span className="text-sm text-white/70 font-medium">職位</span>
          </div>
          <p className="text-white font-semibold">{staffData.position}</p>
        </div>

        <div className="rounded-2xl p-4 bg-green-400">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="h-4 w-4 text-white/80" />
            <span className="text-sm text-white/70 font-medium">年資</span>
          </div>
          <p className="text-white font-semibold">{staffData.yearsOfService}</p>
        </div>
      </div>
    </div>;
});