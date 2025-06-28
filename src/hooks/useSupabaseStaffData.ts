import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface StaffData {
  name: string;
  department: string;
  position: string;
  hire_date: string | null;
  yearsOfService: string;
  totalAnnualLeaveDays: number;
  usedAnnualLeaveDays: number;
  remainingAnnualLeaveDays: number;
}

export const useSupabaseStaffData = () => {
  const { currentUser } = useUser();
  const [staffData, setStaffData] = useState<StaffData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStaffData = async () => {
      if (!currentUser?.id) {
        setIsLoading(false);
        setError('請先登入系統');
        return;
      }

      try {
        console.log('Loading staff data for user:', currentUser.id);
        
        // 修正：使用 user_id 欄位從 staff 表獲取員工資料
        const { data: staffInfo, error: staffError } = await supabase
          .from('staff')
          .select('name, department, position, hire_date')
          .eq('user_id', currentUser.id)
          .single();

        if (staffError) {
          console.error('載入員工資料失敗:', staffError);
          
          if (staffError.code === 'PGRST116') {
            setError('找不到員工資料記錄，請聯繫管理員進行帳號設定');
          } else {
            setError('載入員工資料失敗');
          }
          return;
        }

        if (!staffInfo) {
          console.log('找不到員工資料');
          setError('員工資料不存在，請聯繫管理員確認帳號設定');
          return;
        }

        // 計算年資
        let yearsOfService = '0年';
        let totalAnnualLeaveDays = 0;
        
        if (staffInfo.hire_date) {
          const hireDate = new Date(staffInfo.hire_date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - hireDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          
          if (years > 0) {
            yearsOfService = months > 0 ? `${years}年${months}個月` : `${years}年`;
          } else {
            yearsOfService = `${months}個月`;
          }

          // 根據台灣勞基法計算特休天數
          if (years >= 10) {
            totalAnnualLeaveDays = Math.min(30, 15 + (years - 10) + 1);
          } else if (years >= 5) {
            totalAnnualLeaveDays = 15;
          } else if (years >= 3) {
            totalAnnualLeaveDays = 14;
          } else if (years >= 2) {
            totalAnnualLeaveDays = 10;
          } else if (years >= 1) {
            totalAnnualLeaveDays = 7;
          } else if (diffDays >= 180) { // 滿半年
            totalAnnualLeaveDays = 3;
          }
        }

        // 計算已使用的特休天數
        const currentYear = new Date().getFullYear();
        const { data: leaveRecords, error: leaveError } = await supabase
          .from('leave_requests')
          .select('hours')
          .eq('user_id', currentUser.id)
          .eq('leave_type', 'annual')
          .eq('status', 'approved')
          .gte('start_date', `${currentYear}-01-01`)
          .lte('start_date', `${currentYear}-12-31`);

        let usedAnnualLeaveDays = 0;
        if (!leaveError && leaveRecords) {
          usedAnnualLeaveDays = leaveRecords.reduce((total, record) => {
            return total + (Number(record.hours) / 8);
          }, 0);
        }

        const remainingAnnualLeaveDays = Math.max(0, totalAnnualLeaveDays - usedAnnualLeaveDays);

        setStaffData({
          name: staffInfo.name,
          department: staffInfo.department,
          position: staffInfo.position,
          hire_date: staffInfo.hire_date,
          yearsOfService,
          totalAnnualLeaveDays,
          usedAnnualLeaveDays,
          remainingAnnualLeaveDays,
        });

        setError(null);
      } catch (err) {
        console.error('載入員工資料時發生錯誤:', err);
        setError('載入員工資料時發生系統錯誤');
      } finally {
        setIsLoading(false);
      }
    };

    loadStaffData();
  }, [currentUser?.id]);

  return {
    staffData,
    isLoading,
    error,
  };
};
