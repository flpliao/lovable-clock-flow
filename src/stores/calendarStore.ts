import { create } from 'zustand';
import { CalendarItem, CalendarDayItem } from '@/types/calendar';

interface CalendarPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

interface CalendarState {
  // 行事曆列表
  calendars: CalendarItem[];
  pagination: CalendarPagination | null;

  // 按年份快取的資料
  calendarsByYear: Record<number, CalendarItem[]>;
  loadedYears: Set<number>;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // 基本操作方法
  setCalendars: (calendars: CalendarItem[], pagination?: CalendarPagination | null) => void;
  setCalendarsForYear: (year: number, calendars: CalendarItem[]) => void;
  addCalendar: (calendar: CalendarItem) => void;
  updateCalendar: (slug: string, updates: Partial<CalendarItem>) => void;
  removeCalendar: (slug: string) => void;

  // 查詢方法
  getCalendar: (slug: string) => CalendarItem | undefined;
  getCalendarsByYear: (year: number) => CalendarItem[];
  getCalendarsByName: (name: string) => CalendarItem[];
  getCalendarsByYearAndName: (year: number, name: string) => CalendarItem[];
  isYearLoaded: (year: number) => boolean;
  getCalendarDays: (calendarSlug: string) => CalendarDayItem[];
  updateCalendarDays: (calendarSlug: string, days: CalendarDayItem[]) => void;

  // 狀態管理
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendars: [],
  pagination: null,
  calendarsByYear: {},
  loadedYears: new Set<number>(),
  isLoading: false,
  error: null,

  // 設定行事曆列表
  setCalendars: (calendars: CalendarItem[], pagination?: CalendarPagination | null) => {
    set({ calendars, pagination: pagination || null, error: null });
  },

  // 設定特定年份的資料
  setCalendarsForYear: (year: number, calendars: CalendarItem[]) => {
    set(state => ({
      calendarsByYear: {
        ...state.calendarsByYear,
        [year]: calendars,
      },
      loadedYears: new Set([...state.loadedYears, year]),
      error: null,
    }));
  },

  // 新增行事曆
  addCalendar: (calendar: CalendarItem) => {
    set(state => {
      const year = calendar.year;
      const updatedCalendarsByYear = {
        ...state.calendarsByYear,
        [year]: [calendar, ...(state.calendarsByYear[year] || [])],
      };

      return {
        calendars: [calendar, ...state.calendars],
        calendarsByYear: updatedCalendarsByYear,
      };
    });
  },

  // 更新行事曆
  updateCalendar: (slug: string, updates: Partial<CalendarItem>) => {
    set(state => {
      const updateFn = (cal: CalendarItem) => (cal.slug === slug ? { ...cal, ...updates } : cal);

      return {
        calendars: state.calendars.map(updateFn),
        calendarsByYear: Object.fromEntries(
          Object.entries(state.calendarsByYear).map(([year, calendars]) => [
            year,
            calendars.map(updateFn),
          ])
        ),
      };
    });
  },

  // 移除行事曆
  removeCalendar: (slug: string) => {
    set(state => {
      const filterFn = (cal: CalendarItem) => cal.slug !== slug;

      return {
        calendars: state.calendars.filter(filterFn),
        calendarsByYear: Object.fromEntries(
          Object.entries(state.calendarsByYear).map(([year, calendars]) => [
            year,
            calendars.filter(filterFn),
          ])
        ),
      };
    });
  },

  // 查詢方法
  getCalendar: (slug: string) => {
    const { calendars } = get();
    return calendars.find(cal => cal.slug === slug);
  },

  // 根據年份篩選行事曆
  getCalendarsByYear: (year: number) => {
    const { calendarsByYear } = get();
    return calendarsByYear[year] || [];
  },

  // 根據名稱篩選行事曆（從所有已載入的年份中搜尋）
  getCalendarsByName: (name: string) => {
    const { calendarsByYear } = get();
    const allCalendars = Object.values(calendarsByYear).flat();
    return allCalendars.filter(cal => cal.name.toLowerCase().includes(name.toLowerCase()));
  },

  // 根據年份和名稱篩選行事曆
  getCalendarsByYearAndName: (year: number, name: string) => {
    const { calendarsByYear } = get();
    const yearCalendars = calendarsByYear[year] || [];
    return yearCalendars.filter(cal => cal.name.toLowerCase().includes(name.toLowerCase()));
  },

  // 檢查年份是否已載入
  isYearLoaded: (year: number) => {
    const { loadedYears } = get();
    return loadedYears.has(year);
  },

  getCalendarDays: (calendarSlug: string) => {
    const { calendars } = get();
    const calendar = calendars.find(cal => cal.slug === calendarSlug);
    return calendar?.calendar_days || [];
  },

  updateCalendarDays: (calendarSlug: string, days: CalendarDayItem[]) => {
    set(state => {
      const updateFn = (cal: CalendarItem) =>
        cal.slug === calendarSlug ? { ...cal, calendar_days: days } : cal;

      return {
        calendars: state.calendars.map(updateFn),
        calendarsByYear: Object.fromEntries(
          Object.entries(state.calendarsByYear).map(([year, calendars]) => [
            year,
            calendars.map(updateFn),
          ])
        ),
      };
    });
  },

  // 狀態管理
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      calendars: [],
      pagination: null,
      calendarsByYear: {},
      loadedYears: new Set<number>(),
      isLoading: false,
      error: null,
    }),
}));
