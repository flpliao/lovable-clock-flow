
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
        <div className="text-gray-600">載入中...</div>
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
      </div>
    </div>
  );
};

export default LeaveBalance;
