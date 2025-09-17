import {
  createCalendar,
  deleteCalendar,
  getCalendars,
  updateCalendar,
} from '@/services/calendarService';
import { useCalendarStore } from '@/stores/calendarStore';
import { CalendarIndexParams, CalendarItem } from '@/types/calendar';
import { showError } from '@/utils/toast';
import { useCallback } from 'react';

export const useHolidayManagement = () => {
  const {
    calendars,
    pagination,
    calendarsByYear,
    isLoading,
    error,
    setCalendars,
    setCalendarsForYear,
    addCalendar,
    updateCalendar: updateCalendarInStore,
    removeCalendar,
    getCalendarsByYear,
    isYearLoaded,
    setLoading,
    setError,
  } = useCalendarStore();

  // 載入行事曆列表 - 按年份快取策略
  const loadCalendars = useCallback(
    async (params?: CalendarIndexParams & { forceReload?: boolean }) => {
      setLoading(true);
      setError(null);

      try {
        const { filter } = params || {};
        const year = filter?.year
          ? typeof filter.year === 'string'
            ? parseInt(filter.year)
            : filter.year
          : null;
        const hasNameFilter = !!filter?.name;
        const currentCalendarsByYear = calendarsByYear;
        const hasAllData = Object.keys(currentCalendarsByYear).length > 0;

        // 載入全部資料（無篩選、篩選全部、或只有名稱篩選）
        if (!filter || filter.all || (!year && !hasNameFilter)) {
          // 如果已經有全部資料且不是強制重新載入，直接使用快取
          if (hasAllData && !params?.forceReload) {
            let result = Object.values(currentCalendarsByYear).flat();

            // 如果有名稱篩選，在結果中篩選
            if (hasNameFilter) {
              result = result.filter(cal =>
                cal.name.toLowerCase().includes(filter.name!.toLowerCase())
              );
            }

            setCalendars(result);
            return result;
          }

          // 載入全部資料
          const result = await getCalendars({ ...params, filter: { all: true } });

          // 按年份分類並快取
          const calendarsByYear = result.items.reduce(
            (acc, calendar) => {
              const year = calendar.year;
              acc[year] = acc[year] || [];
              acc[year].push(calendar);
              return acc;
            },
            {} as Record<number, CalendarItem[]>
          );

          // 儲存各年份資料
          Object.entries(calendarsByYear).forEach(([year, calendars]) => {
            setCalendarsForYear(parseInt(year), calendars);
          });

          // 如果有名稱篩選，在結果中篩選
          let finalResult = result.items;
          if (hasNameFilter) {
            finalResult = result.items.filter(cal =>
              cal.name.toLowerCase().includes(filter.name!.toLowerCase())
            );
          }

          setCalendars(finalResult, result.pagination);
          return finalResult;
        }

        // 年份篩選
        if (year) {
          // 已載入且非強制重新載入，使用快取
          if (isYearLoaded(year) && !params?.forceReload) {
            let filteredCalendars = getCalendarsByYear(year);

            // 如果有名稱篩選，在結果中篩選
            if (hasNameFilter) {
              filteredCalendars = filteredCalendars.filter(cal =>
                cal.name.toLowerCase().includes(filter.name!.toLowerCase())
              );
            }

            setCalendars(filteredCalendars);
            return filteredCalendars;
          }

          // 載入該年份資料
          const result = await getCalendars({ ...params, filter: { year } });
          setCalendarsForYear(year, result.items);

          // 如果有名稱篩選，在結果中篩選
          let finalResult = result.items;
          if (hasNameFilter) {
            finalResult = result.items.filter(cal =>
              cal.name.toLowerCase().includes(filter.name!.toLowerCase())
            );
          }

          setCalendars(finalResult, result.pagination);
          return finalResult;
        }

        // 其他情況
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
    [
      calendarsByYear,
      setCalendars,
      setCalendarsForYear,
      getCalendarsByYear,
      isYearLoaded,
      setLoading,
      setError,
    ]
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

  // 更新行事曆
  const updateCalendarItem = async (
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
      const updatedCalendar = await updateCalendar(slug, payload);
      updateCalendarInStore(slug, updatedCalendar);
      return updatedCalendar;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新行事曆失敗';
      setError(errorMessage);
      showError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    // 狀態
    calendars,
    pagination,
    isLoading,
    error,

    // 操作方法
    loadCalendars,
    createCalendarItem,
    updateCalendarItem,
    deleteCalendarItem,
  };
};
