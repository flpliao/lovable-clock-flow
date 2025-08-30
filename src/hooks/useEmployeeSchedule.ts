import { useState, useCallback, useEffect } from 'react';
import { WorkSchedule } from '@/types/workSchedule';
import useEmployeeStore from '@/stores/employeeStore';
import { getEmployeeWithWorkSchedules } from '@/services/employeeWorkScheduleService';
import dayjs from 'dayjs';

interface UseEmployeeScheduleReturn {
  workSchedules: WorkSchedule[];
  isLoading: boolean;
  error: string | null;
  loadScheduleForDateRange: (startDate: string, endDate: string) => Promise<void>;
  getScheduleForDate: (date: string) => WorkSchedule | null;
  hasScheduleForDate: (date: string) => boolean;
  refreshSchedules: () => Promise<void>;
}

/**
 * 獲取當前登入員工的工作排程資料
 */
export const useEmployeeSchedule = (): UseEmployeeScheduleReturn => {
  const { employee } = useEmployeeStore();
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 載入指定日期範圍的工作排程
   */
  const loadScheduleForDateRange = useCallback(
    async (startDate: string, endDate: string) => {
      if (!employee?.slug) {
        setError('無法獲取員工資訊');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const employees = await getEmployeeWithWorkSchedules({
          start_date: startDate,
          end_date: endDate,
        });

        // 找到當前員工的資料
        const currentEmployee = employees.find(emp => emp.slug === employee.slug);

        if (currentEmployee?.work_schedules) {
          setWorkSchedules(currentEmployee.work_schedules);
        } else {
          setWorkSchedules([]);
          setError('找不到工作排程資料');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '載入工作排程失敗';
        setError(errorMessage);
        setWorkSchedules([]);
        console.error('載入工作排程失敗:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [employee?.slug]
  );

  /**
   * 獲取指定日期的工作排程
   */
  const getScheduleForDate = useCallback(
    (date: string): WorkSchedule | null => {
      return (
        workSchedules.find(schedule => {
          // 優先使用 pivot.date
          if (schedule.pivot?.date) {
            return schedule.pivot.date === date;
          }

          // 如果沒有 pivot.date，檢查是否在有效期間內
          // 注意：WorkSchedule 類型中沒有 effective_date 和 end_date，這裡可能需要調整
          // 暫時移除此邏輯，或者需要更新類型定義
          // if (schedule.effective_date && schedule.end_date) {
          //   const targetDate = dayjs(date);
          //   const effectiveDate = dayjs(schedule.effective_date);
          //   const endDate = dayjs(schedule.end_date);
          //
          //   return targetDate.isSameOrAfter(effectiveDate) && targetDate.isSameOrBefore(endDate);
          // }

          return false;
        }) || null
      );
    },
    [workSchedules]
  );

  /**
   * 檢查指定日期是否有工作排程
   */
  const hasScheduleForDate = useCallback(
    (date: string): boolean => {
      return getScheduleForDate(date) !== null;
    },
    [getScheduleForDate]
  );

  /**
   * 重新載入工作排程（使用上次的日期範圍）
   */
  const refreshSchedules = useCallback(async () => {
    if (workSchedules.length > 0) {
      // 獲取當前已載入資料的日期範圍
      const dates = workSchedules
        .map(schedule => schedule.pivot?.date)
        .filter(Boolean)
        .sort();

      if (dates.length > 0) {
        const startDate = dates[0];
        const endDate = dates[dates.length - 1];
        await loadScheduleForDateRange(startDate, endDate);
      }
    }
  }, [workSchedules, loadScheduleForDateRange]);

  /**
   * 當員工資訊變更時清除資料
   */
  useEffect(() => {
    if (!employee?.slug) {
      setWorkSchedules([]);
      setError(null);
    }
  }, [employee?.slug]);

  return {
    workSchedules,
    isLoading,
    error,
    loadScheduleForDateRange,
    getScheduleForDate,
    hasScheduleForDate,
    refreshSchedules,
  };
};

/**
 * 自動載入指定月份工作排程的 Hook
 */
export const useEmployeeScheduleForMonth = (month?: Date) => {
  const employeeSchedule = useEmployeeSchedule();
  const { loadScheduleForDateRange } = employeeSchedule;

  useEffect(() => {
    if (month) {
      const startDate = dayjs(month).startOf('month').format('YYYY-MM-DD');
      const endDate = dayjs(month).endOf('month').format('YYYY-MM-DD');
      loadScheduleForDateRange(startDate, endDate);
    }
  }, [month, loadScheduleForDateRange]);

  return employeeSchedule;
};

/**
 * 自動載入指定日期範圍工作排程的 Hook
 */
export const useEmployeeScheduleForRange = (startDate?: string, endDate?: string) => {
  const employeeSchedule = useEmployeeSchedule();
  const { loadScheduleForDateRange } = employeeSchedule;

  useEffect(() => {
    if (startDate && endDate) {
      loadScheduleForDateRange(startDate, endDate);
    }
  }, [startDate, endDate, loadScheduleForDateRange]);

  return employeeSchedule;
};
