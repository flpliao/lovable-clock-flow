
import React from 'react';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

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
}

export const AnnualLeaveInfoCard = React.memo(function AnnualLeaveInfoCard({ 
  staffData, 
  isLoading 
}: AnnualLeaveInfoCardProps) {
  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
            <div className="h-6 bg-white/30 rounded w-40"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-white/20 rounded-lg"></div>
            <div className="h-20 bg-white/20 rounded-lg"></div>
            <div className="h-20 bg-white/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!staffData) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6">
        <div className="text-center text-gray-600">無法載入特休資訊</div>
      </div>
    );
  }

  // 檢查是否未設定入職日期
  if (!staffData.hire_date) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-orange-400/60 to-orange-300/40 border border-orange-300/50 rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-500/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-orange-900">⚠️ 尚未設定入職日期</h3>
            <p className="text-sm text-orange-800">Annual Leave Setup Required</p>
          </div>
        </div>
        <div className="backdrop-blur-sm bg-orange-100/50 border border-orange-200/60 rounded-xl p-4">
          <div className="text-orange-900 text-center">
            <div className="text-base font-semibold mb-2">請至人員資料設定入職日期以啟用特休制度</div>
            <p className="text-sm text-orange-800">設定入職日期後，系統將自動計算您的特別休假天數</p>
          </div>
        </div>
      </div>
    );
  }

  const usagePercentage = staffData.totalAnnualLeaveDays > 0 
    ? Math.round((staffData.usedAnnualLeaveDays / staffData.totalAnnualLeaveDays) * 100) 
    : 0;

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      {/* 卡片標題 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500/90 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">特別休假資訊</h3>
          <p className="text-sm text-gray-600">Annual Leave Information</p>
        </div>
      </div>

      {/* 年資與特休總覽 */}
      <div className="backdrop-blur-sm bg-blue-100/60 rounded-xl p-4 mb-6 border border-blue-200/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-900 mb-2">
            年資：{staffData.yearsOfService}
          </div>
          <div className="text-lg text-blue-800">
            特休天數：{staffData.totalAnnualLeaveDays} 天（依據入職日自動計算）
          </div>
        </div>
      </div>

      {/* 特休統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 總天數 */}
        <div className="backdrop-blur-sm bg-blue-100/50 border border-blue-200/60 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-900 mb-1">{staffData.totalAnnualLeaveDays}</div>
          <div className="text-blue-800 text-sm font-medium">年度總額（天）</div>
          <div className="text-blue-700 text-xs mt-1">{staffData.totalAnnualLeaveDays * 8} 小時</div>
        </div>

        {/* 已使用天數 */}
        <div className="backdrop-blur-sm bg-orange-100/50 border border-orange-200/60 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-900 mb-1">{staffData.usedAnnualLeaveDays}</div>
          <div className="text-orange-800 text-sm font-medium">已使用（天）</div>
          <div className="text-orange-700 text-xs mt-1">{staffData.usedAnnualLeaveDays * 8} 小時</div>
        </div>

        {/* 剩餘天數 */}
        <div className="backdrop-blur-sm bg-green-100/50 border border-green-200/60 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-900 mb-1">{staffData.remainingAnnualLeaveDays}</div>
          <div className="text-green-800 text-sm font-medium">剩餘可用（天）</div>
          <div className="text-green-700 text-xs mt-1">{staffData.remainingAnnualLeaveDays * 8} 小時</div>
        </div>
      </div>

      {/* 進度條 */}
      <div className="backdrop-blur-sm bg-white/40 rounded-xl p-4 border border-white/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-gray-600" />
            <span className="text-gray-800 font-medium">使用進度</span>
          </div>
          <span className="text-gray-800 font-bold text-lg">{usagePercentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200/60 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div 
            className="bg-gradient-to-r from-blue-500/80 to-green-500/80 h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>0 天</span>
          <span>{staffData.totalAnnualLeaveDays} 天</span>
        </div>
      </div>

      {/* 警告訊息 */}
      {staffData.remainingAnnualLeaveDays <= 2 && staffData.remainingAnnualLeaveDays > 0 && (
        <div className="mt-4 backdrop-blur-sm bg-yellow-100/60 border border-yellow-200/60 rounded-xl p-3">
          <div className="flex items-center gap-2 text-yellow-900">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">特休餘額即將用完，請合理安排休假時間</span>
          </div>
        </div>
      )}

      {staffData.remainingAnnualLeaveDays <= 0 && (
        <div className="mt-4 backdrop-blur-sm bg-red-100/60 border border-red-200/60 rounded-xl p-3">
          <div className="flex items-center gap-2 text-red-900">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">特休已用完，無法申請更多特別休假</span>
          </div>
        </div>
      )}
    </div>
  );
});
