import { useCallback } from 'react';
import { useCalendarStore } from '@/stores/calendarStore';
import {
  getCalendars,
  getCalendar,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  getCalendarDays,
  batchUpdateCalendarDays,
  saveMonthDays,
  generateYearDays,
  clearAllDays,
  copyCalendarToYear,
} from '@/services/calendarService';
import { CalendarDayItem, CalendarIndexParams } from '@/types/calendar';
import { showError } from '@/utils/toast';

export const useCalendarData = () => {
  const {
    calendars,
    pagination,
    isLoading,
    error,
    setCalendars,
    addCalendar,
    updateCalendar: updateCalendarInStore,
    removeCalendar: removeCalendarFromStore,
    setCalendarDays,
    batchUpdateCalendarDays: batchUpdateCalendarDaysInStore,
    setLoading,
    setError,
    isCalendarMonthLoaded,
    getCalendarDays: getCalendarDaysFromStore,
  } = useCalendarStore();

  // === 行事曆基本操作 ===

  // 載入行事曆列表
  const loadCalendars = useCallback(
    async (params?: CalendarIndexParams) => {
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
    [setCalendars, setLoading, setError]
  );

  // 載入單一行事曆
  const loadCalendar = useCallback(
    async (slug: string) => {
      setLoading(true);
      setError(null);

      try {
        const calendar = await getCalendar(slug);

        // 更新 store 中的行事曆資料
        const existingIndex = calendars.findIndex(cal => cal.slug === slug);
        if (existingIndex === -1) {
          addCalendar(calendar);
        } else {
          updateCalendarInStore(slug, calendar);
        }

        return calendar;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '載入行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [calendars, addCalendar, updateCalendarInStore, setLoading, setError]
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

  // 更新行事曆
  const updateCalendarItem = useCallback(
    async (
      slug: string,
      payload: Partial<{
        year: number;
        name: string;
        description?: string | null;
      }>
    ) => {
      setLoading(true);
      setError(null);

      try {
        const calendar = await updateCalendar(slug, payload);
        updateCalendarInStore(slug, calendar);
        return calendar;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '更新行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [updateCalendarInStore, setLoading, setError]
  );

  // 刪除行事曆
  const deleteCalendarItem = useCallback(
    async (slug: string) => {
      setLoading(true);
      setError(null);

      try {
        await deleteCalendar(slug);
        removeCalendarFromStore(slug);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '刪除行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [removeCalendarFromStore, setLoading, setError]
  );

  // 複製行事曆到新年份
  const copyCalendarToYearData = useCallback(
    async (slug: string, newYear: number) => {
      setLoading(true);
      setError(null);

      try {
        const calendar = await copyCalendarToYear(slug, newYear);
        addCalendar(calendar);
        return calendar;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '複製行事曆失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [addCalendar, setLoading, setError]
  );

  // === 行事曆日期操作 ===

  // 載入行事曆日期（支援快取和強制重新載入）
  const loadCalendarDays = useCallback(
    async (
      calendarSlug: string,
      params?: { month?: number; year?: number },
      forceReload: boolean = false
    ) => {
      setLoading(true);
      setError(null);

      try {
        // 如果強制重新載入，直接從 API 取得資料
        if (forceReload) {
          const days = await getCalendarDays(calendarSlug, params);

          // 如果指定了月份，將資料儲存到 store
          if (params?.month && params?.year) {
            const yearMonth = `${params.year}-${params.month.toString().padStart(2, '0')}`;
            setCalendarDays(calendarSlug, yearMonth, days);
          }

          return days;
        }

        // 檢查是否有快取資料
        if (params?.month && params?.year) {
          const yearMonth = `${params.year}-${params.month.toString().padStart(2, '0')}`;
          const cachedDays = getCalendarDaysFromStore(calendarSlug, yearMonth);
          const isMonthLoadedInStore = isCalendarMonthLoaded(calendarSlug, yearMonth);

          // 如果有快取資料，直接返回快取資料
          if (isMonthLoadedInStore && cachedDays.length > 0) {
            setLoading(false);
            return cachedDays;
          }
        }

        // 沒有快取資料，從 API 載入
        const days = await getCalendarDays(calendarSlug, params);

        // 如果指定了月份，將資料儲存到 store
        if (params?.month && params?.year) {
          const yearMonth = `${params.year}-${params.month.toString().padStart(2, '0')}`;
          setCalendarDays(calendarSlug, yearMonth, days);
        }

        return days;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '載入行事曆日期失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setCalendarDays, setLoading, setError, getCalendarDaysFromStore, isCalendarMonthLoaded]
  );

  // 批次更新行事曆日期
  const batchUpdateCalendarDaysData = useCallback(
    async (calendarSlug: string, payload: { updates: CalendarDayItem[] }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await batchUpdateCalendarDays(calendarSlug, payload);

        // 更新 store 中的資料
        if (payload.updates.length > 0) {
          const firstDate = payload.updates[0].date;
          const yearMonth = firstDate.substring(0, 7); // "YYYY-MM"

          // 取得現有資料並合併更新
          const existingDays = getCalendarDaysFromStore(calendarSlug, yearMonth);
          const updatedDays = [...existingDays];

          payload.updates.forEach(update => {
            const existingIndex = updatedDays.findIndex(d => d.date === update.date);
            if (existingIndex !== -1) {
              updatedDays[existingIndex] = { ...updatedDays[existingIndex], ...update };
            } else {
              updatedDays.push(update);
            }
          });

          batchUpdateCalendarDaysInStore(calendarSlug, yearMonth, updatedDays);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '批次更新行事曆日期失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getCalendarDaysFromStore, batchUpdateCalendarDaysInStore, setLoading, setError]
  );

  // 儲存月份資料
  const saveMonthDaysData = useCallback(
    async (calendarSlug: string, monthData: Record<string, CalendarDayItem>, yearMonth: string) => {
      setLoading(true);
      setError(null);

      try {
        const result = await saveMonthDays(calendarSlug, monthData, yearMonth);

        // 更新 store 中的資料
        const daysArray = Object.values(monthData).filter(
          d => d.date.startsWith(yearMonth) && d.type === 'holiday'
        );
        setCalendarDays(calendarSlug, yearMonth, daysArray);

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '儲存月份資料失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setCalendarDays, setLoading, setError]
  );

  // 生成全年日期
  const generateYearDaysData = useCallback(
    async (calendarSlug: string, payload: { year: number }) => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateYearDays(calendarSlug, payload);

        // 標記該年份的所有月份為已載入
        for (let month = 1; month <= 12; month++) {
          const yearMonth = `${payload.year}-${month.toString().padStart(2, '0')}`;
          setCalendarDays(calendarSlug, yearMonth, []);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '生成全年日期失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setCalendarDays, setLoading, setError]
  );

  // 清除全部日期
  const clearAllDaysData = useCallback(
    async (calendarSlug: string) => {
      setLoading(true);
      setError(null);

      try {
        await clearAllDays(calendarSlug);

        // 清除 store 中該行事曆的所有日期資料
        // 注意：這裡需要清除所有已載入的月份資料
        // 由於 clearAllDays 會清除所有資料，我們可以重置該行事曆的載入狀態
        // 實際實作可能需要更複雜的邏輯來處理部分清除
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '清除全部日期失敗';
        setError(errorMessage);
        showError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  // === 查詢方法 ===

  // 檢查月份是否已載入
  const isMonthLoaded = useCallback(
    (calendarSlug: string, yearMonth: string) => {
      return isCalendarMonthLoaded(calendarSlug, yearMonth);
    },
    [isCalendarMonthLoaded]
  );

  // 從 store 取得行事曆日期
  const getCalendarDaysFromStoreData = useCallback(
    (calendarSlug: string, yearMonth: string) => {
      return getCalendarDaysFromStore(calendarSlug, yearMonth);
    },
    [getCalendarDaysFromStore]
  );

  // 取得行事曆
  const getCalendarItem = useCallback(
    (slug: string) => {
      return calendars.find(cal => cal.slug === slug);
    },
    [calendars]
  );

  // 取得已載入的月份列表
  const getLoadedMonthsForCalendar = useCallback(
    (calendarSlug: string) => {
      // 這裡需要從 store 取得已載入的月份
      // 由於 store 中沒有直接的方法，我們可以從 calendarDays 推斷
      const calendarData = calendars.find(cal => cal.slug === calendarSlug);
      if (!calendarData) return [];

      // 這裡可以實作更複雜的邏輯來取得已載入的月份
      return [];
    },
    [calendars]
  );

  return {
    // === 狀態 ===
    calendars,
    pagination,
    isLoading,
    error,

    // === 基本操作方法 ===
    loadCalendars,
    loadCalendar,
    createCalendarItem,
    updateCalendarItem,
    deleteCalendarItem,
    copyCalendarToYearData,

    // === 日期操作方法 ===
    loadCalendarDays,
    batchUpdateCalendarDaysData,
    saveMonthDaysData,
    generateYearDaysData,
    clearAllDaysData,

    // === 查詢方法 ===
    getCalendarItem,
    isMonthLoaded,
    getCalendarDaysFromStoreData,
    getLoadedMonthsForCalendar,

    // === 直接操作方法（用於本地狀態管理） ===
    setCalendars,
    addCalendar,
    updateCalendar: updateCalendarInStore,
    removeCalendar: removeCalendarFromStore,
    setCalendarDays,
    batchUpdateCalendarDays: batchUpdateCalendarDaysInStore,
  };
};
