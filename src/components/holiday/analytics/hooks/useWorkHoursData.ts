
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface MonthlyData {
  month: string;
  workDays: number;
  holidays: number;
  totalHours: number;
  requiredHours: number;
}

export const useWorkHoursData = (selectedYear: number, selectedCountry: string) => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Taiwan labor law defaults
  const workTimeDefaults = {
    weekly_work_hours: 40,
    daily_work_hours: 8,
    annual_leave_days: 7
  };

  const calculateMonthlyData = async () => {
    setLoading(true);
    try {
      const { data: holidays, error } = await supabase
        .from('holidays')
        .select('holiday_date')
        .gte('holiday_date', `${selectedYear}-01-01`)
        .lte('holiday_date', `${selectedYear}-12-31`)
        .eq('is_active', true);

      if (error) {
        console.error('載入假日資料失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入假日資料",
          variant: "destructive"
        });
        return;
      }

      const holidayDates = new Set(holidays?.map(h => h.holiday_date) || []);
      const monthlyStats: MonthlyData[] = [];

      for (let month = 0; month < 12; month++) {
        const year = selectedYear;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let workDays = 0;
        let holidayCount = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          const dateString = date.toISOString().split('T')[0];
          const dayOfWeek = date.getDay();

          if (holidayDates.has(dateString)) {
            holidayCount++;
          } else if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 不是週末
            workDays++;
          }
        }

        const totalHours = workDays * workTimeDefaults.daily_work_hours;
        const requiredHours = Math.floor((daysInMonth - holidayCount) * (workTimeDefaults.weekly_work_hours / 7));

        monthlyStats.push({
          month: `${month + 1}月`,
          workDays,
          holidays: holidayCount,
          totalHours,
          requiredHours
        });
      }

      setMonthlyData(monthlyStats);
    } catch (error) {
      console.error('計算月度資料異常:', error);
      toast({
        title: "計算異常",
        description: "計算工時統計時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateMonthlyData();
  }, [selectedYear, selectedCountry]);

  return { monthlyData, loading };
};
