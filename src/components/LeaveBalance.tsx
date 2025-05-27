
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">特休假餘額</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">載入中...</div>
        </CardContent>
      </Card>
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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">特休假餘額</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">年度總額</span>
            <span className="font-medium">{totalHours} 小時 ({totalDays} 天)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">已使用</span>
            <span className="font-medium">{usedHours} 小時 ({usedDays} 天)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">剩餘時數</span>
            <span className="font-medium text-primary">{remainingHours} 小時 ({remainingDays} 天)</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-right text-muted-foreground">
            已使用 {usagePercentage}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveBalance;
