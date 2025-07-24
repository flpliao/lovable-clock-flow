import { Staff } from '@/components/staff/types';
import { useCurrentUser, usePermissionChecker } from '@/hooks/useStores';
import { useToast } from '@/hooks/useToast';
import { scheduleService } from '@/services/scheduleService';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { timeOptions } from '../constants';
import { generateDaysInMonth } from '../utils/dateUtils';

type FormValues = {
  userId: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
};

interface UseScheduleFormLogicProps {
  staffList: Staff[];
  onScheduleCreated?: () => void;
}

export const useScheduleFormLogic = ({
  staffList,
  onScheduleCreated,
}: UseScheduleFormLogicProps) => {
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const { hasPermissionSync } = usePermissionChecker();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const nextMonthYear = nextMonth.getFullYear();
  const nextMonthValue = (nextMonth.getMonth() + 1).toString().padStart(2, '0');

  const [selectedYear, setSelectedYear] = useState(nextMonthYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(nextMonthValue);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      userId: '',
      selectedYear: nextMonthYear.toString(),
      selectedMonth: nextMonthValue,
      selectedDates: [],
      selectedTimeSlots: [],
    },
  });

  // 初始化時自動全選當前月份
  useEffect(() => {
    const daysInMonth = generateDaysInMonth(selectedYear, selectedMonth);
    const allDates = daysInMonth
      .filter(day => day !== null) // 過濾掉空白格子
      .map(day => day.value);
    setSelectedDates(allDates);
  }, [selectedYear, selectedMonth]); // 當年份或月份改變時重新計算

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleSelectAllMonth = () => {
    const daysInMonth = generateDaysInMonth(selectedYear, selectedMonth);
    const allDates = daysInMonth
      .filter(day => day !== null) // 過濾掉空白格子
      .map(day => day.value);
    setSelectedDates(allDates);
  };

  const handleClearSelection = () => {
    setSelectedDates([]);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // 延遲執行全選，確保 selectedMonth 狀態已更新
    setTimeout(() => {
      const daysInMonth = generateDaysInMonth(selectedYear, month);
      const allDates = daysInMonth
        .filter(day => day !== null) // 過濾掉空白格子
        .map(day => day.value);
      setSelectedDates(allDates);
    }, 0);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // 年份改變時也自動全選
    setTimeout(() => {
      const daysInMonth = generateDaysInMonth(year, selectedMonth);
      const allDates = daysInMonth
        .filter(day => day !== null) // 過濾掉空白格子
        .map(day => day.value);
      setSelectedDates(allDates);
    }, 0);
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(t => t !== timeSlot);
      } else {
        return [timeSlot];
      }
    });
  };

  const getUserName = (userId: string) => {
    // 根據權限獲取可用員工列表
    let availableStaff = [];

    // 🆕 使用同步權限檢查
    const hasCreatePermission = hasPermissionSync('schedule:create');
    if (hasCreatePermission) {
      // 有創建權限可以選擇所有員工
      availableStaff = staffList;
    } else {
      // 否則只能選擇自己（雖然一般用戶不應該看到創建表單）
      const selfStaff = staffList.find(staff => staff.id === currentUser?.id);
      if (selfStaff) {
        availableStaff.push(selfStaff);
      }
    }

    const user = availableStaff.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  // 🔧 添加清除快取功能
  const clearPermissionCache = () => {
    // 清除權限快取
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('permissionRefreshed'));
    }

    // 強制重新載入權限
    setTimeout(() => {
      console.log('🔄 權限快取已清除，重新檢查權限');
    }, 100);
  };

  const onSubmit = async (data: FormValues) => {
    // 🆕 使用同步權限檢查
    if (!hasPermissionSync('schedule:create')) {
      toast({
        title: '權限不足',
        description: '您沒有權限創建排班',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const scheduleData = selectedDates.flatMap(date =>
        selectedTimeSlots.map(timeSlot => {
          const timeOption = timeOptions.find(opt => opt.value === timeSlot);
          return {
            user_id: data.userId,
            work_date: `${selectedYear}-${selectedMonth.padStart(2, '0')}-${date.padStart(2, '0')}`,
            start_time: timeOption?.start || '09:30',
            end_time: timeOption?.end || '17:30',
            time_slot: timeSlot,
            created_by: currentUser?.id || '',
          };
        })
      );

      console.log('提交排班數據：', scheduleData);

      // 直接使用 scheduleService 創建排班
      await scheduleService.createSchedules(scheduleData);

      const isForSelf = data.userId === currentUser?.id;
      const staffName = getUserName(data.userId);

      toast({
        title: '排班成功',
        description: `已為 ${staffName} 在 ${selectedYear}年${selectedMonth}月 安排 ${selectedDates.length} 天班次，共 ${selectedDates.length * selectedTimeSlots.length} 個時段。${isForSelf ? '' : '（代為排班）'}`,
      });

      setSelectedDates([]);
      setSelectedTimeSlots([]);
      form.reset();

      // 通知父組件重新載入資料
      if (onScheduleCreated) {
        onScheduleCreated();
      }
    } catch (err) {
      console.error('排班提交失敗:', err);
      setError(err instanceof Error ? err.message : '發生未知錯誤，請稍後重試');
      toast({
        title: '排班失敗',
        description: err instanceof Error ? err.message : '發生未知錯誤，請稍後重試',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    selectedYear,
    selectedMonth,
    selectedDates,
    selectedTimeSlots,
    loading,
    error,
    setSelectedYear: handleYearChange,
    setSelectedMonth: handleMonthChange,
    handleDateToggle,
    handleSelectAllMonth,
    handleClearSelection,
    handleTimeSlotToggle,
    getUserName,
    clearPermissionCache,
    onSubmit,
  };
};
