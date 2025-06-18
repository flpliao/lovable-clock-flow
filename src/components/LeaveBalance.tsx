
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';

const LeaveBalance: React.FC = () => {
  const { currentUser } = useUser();
  const { loadAnnualLeaveBalance, initializeAnnualLeaveBalance } = useSupabaseLeaveManagement();
  const [balance, setBalance] = useState<any>(null);
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
        <div className="text-white/80 font-medium drop-shadow-md">載入中...</div>
      </div>
    );
  }
  
  // Calculate remaining hours and percentage
  const totalDays = balance?.total_days || 0;
  const usedDays = balance?.used_days || 0;
  const remainingDays = balance?.remaining_days || (totalDays - usedDays);
  
  // Convert to hours (8 hours per day)
  const totalHours = totalDays * 8;
  const usedHours = usedDays * 8;
  const remainingHours = remainingDays * 8;
  
  const usagePercentage = totalHours > 0 ? Math.round((usedHours / totalHours) * 100) : 0;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-white drop-shadow-md">{totalHours}</div>
            <div className="text-white/80 text-sm font-medium drop-shadow-md">年度總額（小時）</div>
            <div className="text-white/70 text-xs drop-shadow-md">{totalDays} 天</div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-white drop-shadow-md">{usedHours}</div>
            <div className="text-white/80 text-sm font-medium drop-shadow-md">已使用（小時）</div>
            <div className="text-white/70 text-xs drop-shadow-md">{usedDays} 天</div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-4 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-300 drop-shadow-md">{remainingHours}</div>
            <div className="text-white/80 text-sm font-medium drop-shadow-md">剩餘時數（小時）</div>
            <div className="text-white/70 text-xs drop-shadow-md">{remainingDays} 天</div>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 font-medium drop-shadow-md">使用進度</span>
          <span className="text-white font-bold drop-shadow-md">{usagePercentage}%</span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-300" 
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalance;
