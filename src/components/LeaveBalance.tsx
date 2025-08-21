import { useCurrentUser } from '@/hooks/useStores';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { AnnualLeaveBalance } from '@/types';
import { calculateAnnualLeaveDays, formatYearsOfService } from '@/utils/annualLeaveCalculator';
import React, { useEffect, useState } from 'react';

const LeaveBalance: React.FC = () => {
  const currentUser = useCurrentUser();
  const { loadAnnualLeaveBalance, initializeAnnualLeaveBalance } = useSupabaseLeaveManagement();
  const [balance, setBalance] = useState<AnnualLeaveBalance | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadBalance = async () => {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        // 先嘗試載入現有餘額
        let balanceData = await loadAnnualLeaveBalance(currentUser.id);
        
        // 如果沒有餘額記錄，先初始化
        if (!balanceData) {
          await initializeAnnualLeaveBalance(currentUser.id);
          balanceData = await loadAnnualLeaveBalance(currentUser.id);
        }
        
        setBalance(balanceData);
      } catch (error) {
        console.error('載入年假餘額失敗:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBalance();
  }, [currentUser, loadAnnualLeaveBalance, initializeAnnualLeaveBalance]);
  
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-200 rounded-xl h-20"></div>
            <div className="bg-gray-200 rounded-xl h-20"></div>
            <div className="bg-gray-200 rounded-xl h-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // 計算年資和應有天數（用於比對）
  const hireDate = currentUser?.hire_date ? new Date(currentUser.hire_date) : null;
  const calculatedEntitlement = hireDate ? calculateAnnualLeaveDays(hireDate) : 0;
  const formattedYears = hireDate ? formatYearsOfService(hireDate) : '未設定';
  
  // 使用資料庫資料或計算值
  const totalDays = balance?.total_days || calculatedEntitlement;
  const usedDays = balance?.used_days || 0;
  const remainingDays = totalDays - usedDays;
  
  // Convert to hours (8 hours per day)
  const totalHours = totalDays * 8;
  const usedHours = usedDays * 8;
  const remainingHours = remainingDays * 8;
  
  const usagePercentage = totalHours > 0 ? Math.round((usedHours / totalHours) * 100) : 0;
  
  return (
    <div className="space-y-4">
      {/* 年資資訊 */}
      {hireDate && (
        <div className="bg-blue-50 rounded-xl border p-4 mb-4">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">服務年資</div>
            <div className="text-lg font-bold text-blue-600">{formattedYears}</div>
            <div className="text-xs text-gray-500">
              入職日期：{hireDate.toLocaleDateString('zh-TW')}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalHours}</div>
            <div className="text-gray-600 text-sm">年度總額（小時）</div>
            <div className="text-gray-500 text-xs">{totalDays} 天</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{usedHours}</div>
            <div className="text-gray-600 text-sm">已使用（小時）</div>
            <div className="text-gray-500 text-xs">{usedDays} 天</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{remainingHours}</div>
            <div className="text-gray-600 text-sm">剩餘時數（小時）</div>
            <div className="text-gray-500 text-xs">{remainingDays} 天</div>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="bg-gray-50 rounded-xl border p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">使用進度</span>
          <span className="text-gray-900 font-bold">{usagePercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0 天</span>
          <span>{totalDays} 天</span>
        </div>
      </div>

      {/* 提醒訊息 */}
      {remainingDays <= 2 && remainingDays > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">特休餘額即將用完，請合理安排休假時間</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveBalance;
