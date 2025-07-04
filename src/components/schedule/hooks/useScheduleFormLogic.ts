import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, usePermissionChecker } from '@/hooks/useStores';
import { useState, useEffect } from 'react';
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

export const useScheduleFormLogic = () => {
  const { toast } = useToast();
  const { addSchedules, loading, error } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const currentUser = useCurrentUser();
  const { hasPermission } = usePermissionChecker();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      userId: '',
      selectedYear: currentYear.toString(),
      selectedMonth: currentMonth.toString(),
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
  }, []); // 只在組件初始化時執行一次

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

    // 使用 Promise 來處理異步權限檢查
    hasPermission('schedule:create').then(hasCreatePermission => {
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
    });

    const user = availableStaff.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  const onSubmit = async (data: FormValues) => {
    // 檢查創建權限
    if (!(await hasPermission('schedule:create'))) {
      toast({
        title: '權限不足',
        description: '您沒有權限創建排班',
        variant: 'destructive',
      });
      return;
    }

    try {
      const scheduleData = selectedDates.flatMap(date =>
        selectedTimeSlots.map(timeSlot => {
          const timeOption = timeOptions.find(opt => opt.value === timeSlot);
          return {
            userId: data.userId,
            workDate: `${selectedYear}-${selectedMonth.padStart(2, '0')}-${date.padStart(2, '0')}`,
            startTime: timeOption?.start || '09:30',
            endTime: timeOption?.end || '17:30',
            timeSlot: timeSlot,
          };
        })
      );

      console.log('提交排班數據：', scheduleData);

      await addSchedules(scheduleData);

      const isForSelf = data.userId === currentUser?.id;
      const staffName = getUserName(data.userId);

      toast({
        title: '排班成功',
        description: `已為 ${staffName} 在 ${selectedYear}年${selectedMonth}月 安排 ${selectedDates.length} 天班次，共 ${selectedDates.length * selectedTimeSlots.length} 個時段。${isForSelf ? '' : '（代為排班）'}`,
      });

      setSelectedDates([]);
      setSelectedTimeSlots([]);
      form.reset();
    } catch (err) {
      console.error('排班提交失敗:', err);
      toast({
        title: '排班失敗',
        description: err instanceof Error ? err.message : '發生未知錯誤，請稍後重試',
        variant: 'destructive',
      });
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
    onSubmit,
  };
};
