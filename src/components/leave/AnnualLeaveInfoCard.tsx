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
    return <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
            <div className="h-6 bg-white/30 rounded w-40"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-white/20 rounded-xl"></div>
            <div className="h-20 bg-white/20 rounded-xl"></div>
            <div className="h-20 bg-white/20 rounded-xl"></div>
          </div>
        </div>
      </div>;
  }
  if (!staffData) {
    return <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center text-white/70">無法載入特休資訊</div>
      </div>;
  }

  // 檢查是否未設定入職日期
  if (!staffData.hire_date) {
    return <div className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">⚠️ 尚未設定入職日期</h3>
            <p className="text-sm text-white/80 font-medium drop-shadow-sm">Annual Leave Setup Required</p>
          </div>
        </div>
        <div className="bg-orange-500/20 border border-orange-300/30 rounded-xl p-4">
          <div className="text-white text-center">
            <div className="text-base font-semibold mb-2">請至人員資料設定入職日期以啟用特休制度</div>
            <p className="text-sm text-white/90">設定入職日期後，系統將自動計算您的特別休假天數</p>
          </div>
        </div>
      </div>;
  }
  const usagePercentage = staffData.totalAnnualLeaveDays > 0 ? Math.round(staffData.usedAnnualLeaveDays / staffData.totalAnnualLeaveDays * 100) : 0;
  return <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      {/* 卡片標題 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">特別休假資訊</h3>
          <p className="text-sm text-white/80 font-medium drop-shadow-sm">Annual Leave Information</p>
        </div>
      </div>

      {/* 年資與特休總覽 */}
      <div className="bg-white/10 rounded-2xl p-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-2">
            年資：{staffData.yearsOfService}
          </div>
          <div className="text-lg text-white/90">
            特休天數：{staffData.totalAnnualLeaveDays} 天（依據入職日自動計算）
          </div>
        </div>
      </div>

      {/* 特休統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 總天數 */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-300/30 rounded-2xl p-4 text-center bg-purple-600">
          <div className="text-2xl font-bold text-white mb-1">{staffData.totalAnnualLeaveDays}</div>
          <div className="text-blue-100 text-sm font-medium">年度總額（天）</div>
          <div className="text-blue-200/80 text-xs mt-1">{staffData.totalAnnualLeaveDays * 8} 小時</div>
        </div>

        {/* 已使用天數 */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/30 rounded-2xl p-4 text-center bg-teal-300">
          <div className="text-2xl font-bold text-white mb-1">{staffData.usedAnnualLeaveDays}</div>
          <div className="text-orange-100 text-sm font-medium">已使用（天）</div>
          <div className="text-orange-200/80 text-xs mt-1">{staffData.usedAnnualLeaveDays * 8} 小時</div>
        </div>

        {/* 剩餘天數 */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-300/30 rounded-2xl p-4 text-center bg-green-400">
          <div className="text-2xl font-bold text-white mb-1">{staffData.remainingAnnualLeaveDays}</div>
          <div className="text-green-100 text-sm font-medium">剩餘可用（天）</div>
          <div className="text-green-200/80 text-xs mt-1">{staffData.remainingAnnualLeaveDays * 8} 小時</div>
        </div>
      </div>

      {/* 進度條 */}
      <div className="rounded-2xl p-4 bg-amber-500">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-white/80" />
            <span className="text-white font-medium">使用進度</span>
          </div>
          <span className="text-white font-bold text-lg">{usagePercentage}%</span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out shadow-lg" style={{
          width: `${Math.min(usagePercentage, 100)}%`
        }} />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-white/70">
          <span>0 天</span>
          <span>{staffData.totalAnnualLeaveDays} 天</span>
        </div>
      </div>

      {/* 警告訊息 */}
      {staffData.remainingAnnualLeaveDays <= 2 && staffData.remainingAnnualLeaveDays > 0 && <div className="mt-4 bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-3">
          <div className="flex items-center gap-2 text-yellow-100">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">特休餘額即將用完，請合理安排休假時間</span>
          </div>
        </div>}

      {staffData.remainingAnnualLeaveDays <= 0 && <div className="mt-4 bg-red-500/20 border border-red-300/30 rounded-xl p-3">
          <div className="flex items-center gap-2 text-red-100">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium">特休已用完，無法申請更多特別休假</span>
          </div>
        </div>}
    </div>;
});