import { useCallback, useState } from 'react';
import { scheduleService, Schedule } from '@/services/scheduleService';
import { useCurrentUser } from '@/hooks/useStores';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export const useUserSchedules = () => {
  const currentUser = useCurrentUser();
  const [userSchedules, setUserSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);

  // 載入用戶的排班記錄
  const loadUserSchedules = useCallback(
    async (month?: Date) => {
      if (!currentUser?.id) {
        console.log('沒有使用者 ID，跳過載入排班記錄');
        setUserSchedules([]);
        return;
      }

      setLoading(true);
      try {
        console.log('開始載入用戶排班記錄，使用者ID:', currentUser.id);

        let schedules: Schedule[];

        if (month) {
          // 如果指定了月份，只載入該月份的排班
          const startDate = format(startOfMonth(month), 'yyyy-MM-dd');
          const endDate = format(endOfMonth(month), 'yyyy-MM-dd');
          schedules = await scheduleService.getSchedulesForDateRange(startDate, endDate);
          // 過濾出當前用戶的排班
          schedules = schedules.filter(schedule => schedule.user_id === currentUser.id);
        } else {
          // 載入用戶所有排班記錄
          schedules = await scheduleService.getSchedulesForUser(currentUser.id);
        }

        console.log('成功載入排班記錄:', schedules.length, '筆');
        setUserSchedules(schedules);
      } catch (error) {
        console.error('載入排班記錄失敗:', error);
        setUserSchedules([]);
      } finally {
        setLoading(false);
      }
    },
    [currentUser?.id]
  );

  // 重新整理排班記錄
  const refreshUserSchedules = useCallback(
    async (month?: Date) => {
      await loadUserSchedules(month);
    },
    [loadUserSchedules]
  );

  // 檢查指定日期是否有排班
  const hasScheduleForDate = useCallback(
    (date: string) => {
      return userSchedules.some(schedule => schedule.work_date === date);
    },
    [userSchedules]
  );

  // 獲取指定日期的排班記錄
  const getScheduleForDate = useCallback(
    (date: string) => {
      return userSchedules.find(schedule => schedule.work_date === date);
    },
    [userSchedules]
  );

  return {
    userSchedules,
    loading,
    loadUserSchedules,
    refreshUserSchedules,
    hasScheduleForDate,
    getScheduleForDate,
  };
};
