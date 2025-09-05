import { useCallback } from 'react';
import { useCalendarStore } from '@/stores/calendarStore';
import { getCalendars, deleteCalendar, createCalendar } from '@/services/calendarService';
import { CalendarIndexParams } from '@/types/calendar';
import { showError } from '@/utils/toast';

export const useHolidayManagement = () => {
  const {
    calendars,
    pagination,
    isLoading,
    error,
    setCalendars,
    addCalendar,
    removeCalendar,
    setLoading,
    setError,
  } = useCalendarStore();

  // 載入行事曆列表 - 優先從 store 取得，沒有才打 API
  const loadCalendars = useCallback(
    async (params?: CalendarIndexParams & { forceReload?: boolean }) => {
      // 如果 store 中已有資料且沒有強制重新載入，直接返回
      if (calendars.length > 0 && !params?.forceReload) {
        return calendars;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getCalendars(params);
        setCalendars(result.items, result.pagination);
        return result.items;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '載入行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [calendars, setCalendars, setLoading, setError]
  );

  // 刪除行事曆
  const deleteCalendarItem = useCallback(
    async (slug: string) => {
      setLoading(true);
      setError(null);

      try {
        await deleteCalendar(slug);
        removeCalendar(slug);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '刪除行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [removeCalendar, setLoading, setError]
  );

  // 建立行事曆
  const createCalendarItem = useCallback(
    async (payload: { year: number; name: string; description?: string | null }) => {
      setLoading(true);
      setError(null);

      try {
        const calendar = await createCalendar(payload);
        addCalendar(calendar);
        return calendar;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '建立行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [addCalendar, setLoading, setError]
  );

  return {
    // 狀態
    calendars,
    pagination,
    isLoading,
    error,

    // 操作方法
    loadCalendars,
    createCalendarItem,
    deleteCalendarItem,
  };
};
