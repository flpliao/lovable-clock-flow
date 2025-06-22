
import React from 'react';
import { User } from '@/types';
import { calculateYearsOfService, calculateAnnualLeaveDays, formatYearsOfService } from '@/utils/annualLeaveCalculator';
import { CalendarDays, Clock, TrendingUp } from 'lucide-react';

interface AnnualLeaveBalanceCardProps {
  currentUser: User | null;
  balanceData?: {
    total_days: number;
    used_days: number;
    remaining_days: number;
  } | null;
  loading?: boolean;
}

export const AnnualLeaveBalanceCard = React.memo(function AnnualLeaveBalanceCard({ 
  currentUser, 
  balanceData, 
  loading = false 
}: AnnualLeaveBalanceCardProps) {
  // 計算年資和特休天數
  const calculatedData = React.useMemo(() => {
    if (!currentUser) return null;

    const hireDate = currentUser.hire_date ? new Date(currentUser.hire_date) : null;
    const yearsOfService = hireDate ? calculateYearsOfService(hireDate) : 0;
    const entitledDays = hireDate ? calculateAnnualLeaveDays(hireDate) : 0;
    const formattedYears = hireDate ? formatYearsOfService(hireDate) : '未設定';

    return {
      hireDate,
      yearsOfService,
      entitledDays,
      formattedYears
    };
  }, [currentUser]);

  if (loading) {
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

  if (!currentUser) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center text-white/70">請先登入以查看特休餘額</div>
      </div>
    );
  }

  if (!calculatedData) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center text-white/70">計算年資資訊中...</div>
      </div>
    );
  }

  // 檢查是否未設定入職日期
  if (!calculatedData.hireDate) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md">特別休假設定</h3>
            <p className="text-sm text-white/80 font-medium drop-shadow-sm">Annual Leave Setup</p>
          </div>
        </div>
        
        {/* 顯示員工基本資訊即使沒有入職日期 */}
        <div className="bg-white/10 rounded-2xl p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <div>
              <p className="text-sm text-white/70 font-medium mb-1">員工姓名</p>
              <p className="text-white font-semibold text-lg">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-sm text-white/70 font-medium mb-1">部門職位</p>
              <p className="text-white font-semibold">{currentUser.department} / {currentUser.position}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-4">
          <div className="text-yellow-100 text-center">
            <div className="text-lg font-semibold mb-2">⚠️ 尚未設定入職日期</div>
            <p className="text-sm">請至人員資料設定入職日期以啟用特休制度</p>
          </div>
        </div>
      </div>
    );
  }

  // 使用計算的資料或從資料庫取得的資料
  const totalDays = balanceData?.total_days ?? calculatedData.entitledDays;
  const usedDays = balanceData?.used_days ?? 0;
  const remainingDays = balanceData?.remaining_days ?? (totalDays - usedDays);

  // 計算使用百分比
  const usagePercentage = totalDays > 0 ? Math.round((usedDays / totalDays) * 100) : 0;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      {/* 卡片標題 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <CalendarDays className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white drop-shadow-md">特別休假餘額</h3>
          <p className="text-sm text-white/80 font-medium drop-shadow-sm">Annual Leave Balance</p>
        </div>
      </div>

      {/* 員工基本資訊 */}
      <div className="bg-white/10 rounded-2xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">員工姓名</p>
            <p className="text-white font-semibold text-lg">{currentUser.name}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">部門職位</p>
            <p className="text-white font-semibold">{currentUser.department} / {currentUser.position}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium mb-1">年資</p>
            <p className="text-white font-semibold flex items-center justify-center md:justify-start gap-1">
              <TrendingUp className="h-4 w-4" />
              {calculatedData.formattedYears}
            </p>
          </div>
        </div>
      </div>

      {/* 特休統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 總天數 */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-300/30 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{totalDays}</div>
          <div className="text-blue-100 text-sm font-medium">年度總額（天）</div>
          <div className="text-blue-200/80 text-xs mt-1">{totalDays * 8} 小時</div>
        </div>

        {/* 已使用天數 */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-300/30 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{usedDays}</div>
          <div className="text-orange-100 text-sm font-medium">已使用（天）</div>
          <div className="text-orange-200/80 text-xs mt-1">{usedDays * 8} 小時</div>
        </div>

        {/* 剩餘天數 */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-300/30 rounded-2xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{remainingDays}</div>
          <div className="text-green-100 text-sm font-medium">剩餘可用（天）</div>
          <div className="text-green-200/80 text-xs mt-1">{remainingDays * 8} 小時</div>
        </div>
      </div>

      {/* 進度條 */}
      <div className="bg-white/10 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/80" />
            <span className="text-white font-medium">使用進度</span>
          </div>
          <span className="text-white font-bold text-lg">{usagePercentage}%</span>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out shadow-lg" 
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        
        {/* 進度條標籤 */}
        <div className="flex justify-between mt-2 text-xs text-white/70">
          <span>{usedDays} 天</span>
          <span>{totalDays} 天</span>
        </div>
      </div>

      {/* 警告訊息 */}
      {remainingDays <= 2 && remainingDays > 0 && (
        <div className="mt-4 bg-yellow-500/20 border border-yellow-300/30 rounded-xl p-3">
          <div className="flex items-center gap-2 text-yellow-100">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">特休餘額即將用完，請合理安排休假時間</span>
          </div>
        </div>
      )}

      {remainingDays <= 0 && (
        <div className="mt-4 bg-red-500/20 border border-red-300/30 rounded-xl p-3">
          <div className="flex items-center gap-2 text-red-100">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium">特休已用完，無法申請更多特別休假</span>
          </div>
        </div>
      )}
    </div>
  );
});
