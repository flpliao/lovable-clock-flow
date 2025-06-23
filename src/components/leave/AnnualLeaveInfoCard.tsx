
import React from 'react';
import { Calendar, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface AnnualLeaveInfoCardProps {
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

export const AnnualLeaveInfoCard = React.memo(function AnnualLeaveInfoCard({
  staffData,
  isLoading,
  error
}: AnnualLeaveInfoCardProps) {
  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/30 rounded-lg"></div>
            <div className="h-4 bg-white/30 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-16 bg-white/20 rounded-lg"></div>
            <div className="h-16 bg-white/20 rounded-lg"></div>
            <div className="h-16 bg-white/20 rounded-lg"></div>
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
          <span className="text-sm font-medium">載入特休資料失敗: {error}</span>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
        <div className="text-center text-white/70 text-sm">無法載入特休資訊</div>
      </div>
    );
  }

  // 檢查是否未設定入職日期
  if (!staffData.hire_date) {
    return (
      <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-2xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-3 w-3 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-white drop-shadow-md">特別休假資訊</h3>
        </div>
        <div className="bg-orange-500/20 border border-orange-300/30 rounded-lg p-3">
          <div className="text-white text-center text-sm">
            <div className="font-semibold mb-1">⚠️ 尚未設定入職日期</div>
            <div className="text-white/90 text-xs">請至人員資料設定入職日期以啟用特休制度</div>
          </div>
        </div>
      </div>
    );
  }

  const usagePercentage = staffData.totalAnnualLeaveDays > 0 
    ? Math.round((staffData.usedAnnualLeaveDays / staffData.totalAnnualLeaveDays) * 100) 
    : 0;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
      {/* 簡化的標題 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Calendar className="h-3 w-3 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-white drop-shadow-md">特別休假資訊</h3>
        <div className="text-xs text-white/70 ml-auto">年資：{staffData.yearsOfService}</div>
      </div>

      {/* 緊湊的特休統計 */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* 總天數 */}
        <div className="bg-blue-400/80 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-white">{staffData.totalAnnualLeaveDays}</div>
          <div className="text-white/80 text-xs">年度總額</div>
        </div>

        {/* 已使用天數 */}
        <div className="bg-orange-400/80 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-white">{staffData.usedAnnualLeaveDays}</div>
          <div className="text-white/80 text-xs">已使用</div>
        </div>

        {/* 剩餘天數 */}
        <div className="bg-green-400/80 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-white">{staffData.remainingAnnualLeaveDays}</div>
          <div className="text-white/80 text-xs">剩餘可用</div>
        </div>
      </div>

      {/* 簡化的進度條 */}
      <div className="bg-white/10 rounded-lg p-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-white text-xs">使用進度</span>
          <span className="text-white font-semibold text-xs">{usagePercentage}%</span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* 警告訊息 */}
      {staffData.remainingAnnualLeaveDays <= 2 && staffData.remainingAnnualLeaveDays > 0 && (
        <div className="mt-3 bg-yellow-500/20 border border-yellow-300/30 rounded-lg p-2">
          <div className="flex items-center gap-2 text-yellow-100">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">特休餘額即將用完</span>
          </div>
        </div>
      )}

      {staffData.remainingAnnualLeaveDays <= 0 && (
        <div className="mt-3 bg-red-500/20 border border-red-300/30 rounded-lg p-2">
          <div className="flex items-center gap-2 text-red-100">
            <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
            <span className="text-xs font-medium">特休已用完</span>
          </div>
        </div>
      )}
    </div>
  );
});
