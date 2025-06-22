
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
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-20 bg-gray-100 rounded-xl"></div>
            <div className="h-20 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm p-6">
        <div className="text-center text-gray-500">無法載入人員資料</div>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* 卡片標題 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">人員資訊</h3>
          <p className="text-sm text-gray-500 font-medium">Staff Information</p>
        </div>
      </div>

      {/* 基本資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">員工姓名</span>
          </div>
          <p className="text-gray-900 font-semibold text-lg">{staffData.name}</p>
        </div>

        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Building className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">部門</span>
          </div>
          <p className="text-gray-900 font-semibold">{staffData.department}</p>
        </div>

        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">職位</span>
          </div>
          <p className="text-gray-900 font-semibold">{staffData.position}</p>
        </div>

        <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">年資</span>
          </div>
          <p className="text-gray-900 font-semibold">{staffData.yearsOfService}</p>
        </div>
      </div>
    </div>
  );
});
