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

  // 行事曆日期資料 (calendarSlug -> year-month -> CalendarDayItem[])
  calendarDays: Record<string, Record<string, CalendarDayItem[]>>;

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // 已載入的月份記錄 (calendarSlug -> Set of periods "YYYY-MM")
  loadedCalendarMonths: Record<string, Set<string>>;

  // 基本操作方法
  setCalendars: (calendars: CalendarItem[], pagination?: CalendarPagination | null) => void;
  addCalendar: (calendar: CalendarItem) => void;
  updateCalendar: (slug: string, updates: Partial<CalendarItem>) => void;
  removeCalendar: (slug: string) => void;

  // 行事曆日期相關操作
  setCalendarDays: (calendarSlug: string, yearMonth: string, days: CalendarDayItem[]) => void;
  addCalendarDay: (calendarSlug: string, day: CalendarDayItem) => void;
  updateCalendarDay: (
    calendarSlug: string,
    daySlug: string,
    updates: Partial<CalendarDayItem>
  ) => void;
  removeCalendarDay: (calendarSlug: string, daySlug: string) => void;
  batchUpdateCalendarDays: (
    calendarSlug: string,
    yearMonth: string,
    days: CalendarDayItem[]
  ) => void;

  // 查詢方法
  getCalendar: (slug: string) => CalendarItem | undefined;
  getCalendarDays: (calendarSlug: string, yearMonth: string) => CalendarDayItem[];
  isCalendarMonthLoaded: (calendarSlug: string, yearMonth: string) => boolean;
  getLoadedMonthsForCalendar: (calendarSlug: string) => string[];

  // 狀態管理
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendars: [],
  pagination: null,
  calendarDays: {},
  isLoading: false,
  error: null,
  loadedCalendarMonths: {},

  // 設定行事曆列表
  setCalendars: (calendars: CalendarItem[], pagination?: CalendarPagination | null) => {
    set({ calendars, pagination: pagination || null, error: null });
  },

  // 新增行事曆
  addCalendar: (calendar: CalendarItem) => {
    set(state => ({
      calendars: [calendar, ...state.calendars],
    }));
  },

  // 更新行事曆
  updateCalendar: (slug: string, updates: Partial<CalendarItem>) => {
    set(state => ({
      calendars: state.calendars.map(cal => (cal.slug === slug ? { ...cal, ...updates } : cal)),
    }));
  },

  // 移除行事曆
  removeCalendar: (slug: string) => {
    set(state => ({
      calendars: state.calendars.filter(cal => cal.slug !== slug),
      calendarDays: Object.fromEntries(
        Object.entries(state.calendarDays).filter(([key]) => key !== slug)
      ),
      loadedCalendarMonths: Object.fromEntries(
        Object.entries(state.loadedCalendarMonths).filter(([key]) => key !== slug)
      ),
    }));
  },

  // 設定行事曆日期
  setCalendarDays: (calendarSlug: string, yearMonth: string, days: CalendarDayItem[]) => {
    set(state => {
      const updatedCalendarDays = { ...state.calendarDays };
      if (!updatedCalendarDays[calendarSlug]) {
        updatedCalendarDays[calendarSlug] = {};
      }
      updatedCalendarDays[calendarSlug][yearMonth] = days;

      const updatedLoadedCalendarMonths = { ...state.loadedCalendarMonths };
      if (!updatedLoadedCalendarMonths[calendarSlug]) {
        updatedLoadedCalendarMonths[calendarSlug] = new Set();
      }
      updatedLoadedCalendarMonths[calendarSlug].add(yearMonth);

      return {
        calendarDays: updatedCalendarDays,
        loadedCalendarMonths: updatedLoadedCalendarMonths,
        error: null,
      };
    });
  },

  // 新增行事曆日期
  addCalendarDay: (calendarSlug: string, day: CalendarDayItem) => {
    set(state => {
      const updatedCalendarDays = { ...state.calendarDays };
      if (!updatedCalendarDays[calendarSlug]) {
        updatedCalendarDays[calendarSlug] = {};
      }

      // 找出對應的年月
      const yearMonth = day.date.substring(0, 7); // "YYYY-MM"
      if (!updatedCalendarDays[calendarSlug][yearMonth]) {
        updatedCalendarDays[calendarSlug][yearMonth] = [];
      }

      // 檢查是否已存在相同日期的記錄
      const existingIndex = updatedCalendarDays[calendarSlug][yearMonth].findIndex(
        d => d.date === day.date
      );

      if (existingIndex !== -1) {
        // 更新現有記錄
        updatedCalendarDays[calendarSlug][yearMonth][existingIndex] = day;
      } else {
        // 新增記錄
        updatedCalendarDays[calendarSlug][yearMonth] = [
          ...updatedCalendarDays[calendarSlug][yearMonth],
          day,
        ];
      }

      return { calendarDays: updatedCalendarDays };
    });
  },

  // 更新行事曆日期
  updateCalendarDay: (calendarSlug: string, daySlug: string, updates: Partial<CalendarDayItem>) => {
    set(state => {
      const updatedCalendarDays = { ...state.calendarDays };
      if (!updatedCalendarDays[calendarSlug]) return state;

      // 遍歷所有月份尋找要更新的日期
      Object.keys(updatedCalendarDays[calendarSlug]).forEach(yearMonth => {
        const monthDays = updatedCalendarDays[calendarSlug][yearMonth];
        const dayIndex = monthDays.findIndex(d => d.slug === daySlug);
        if (dayIndex !== -1) {
          updatedCalendarDays[calendarSlug][yearMonth][dayIndex] = {
            ...monthDays[dayIndex],
            ...updates,
          };
        }
      });

      return { calendarDays: updatedCalendarDays };
    });
  },

  // 移除行事曆日期
  removeCalendarDay: (calendarSlug: string, daySlug: string) => {
    set(state => {
      const updatedCalendarDays = { ...state.calendarDays };
      if (!updatedCalendarDays[calendarSlug]) return state;

      // 遍歷所有月份尋找要移除的日期
      Object.keys(updatedCalendarDays[calendarSlug]).forEach(yearMonth => {
        updatedCalendarDays[calendarSlug][yearMonth] = updatedCalendarDays[calendarSlug][
          yearMonth
        ].filter(d => d.slug !== daySlug);
      });

      return { calendarDays: updatedCalendarDays };
    });
  },

  // 批次更新行事曆日期
  batchUpdateCalendarDays: (calendarSlug: string, yearMonth: string, days: CalendarDayItem[]) => {
    set(state => {
      const updatedCalendarDays = { ...state.calendarDays };
      if (!updatedCalendarDays[calendarSlug]) {
        updatedCalendarDays[calendarSlug] = {};
      }

      // 更新現有記錄或新增新記錄
      updatedCalendarDays[calendarSlug][yearMonth] = days;

      const updatedLoadedCalendarMonths = { ...state.loadedCalendarMonths };
      if (!updatedLoadedCalendarMonths[calendarSlug]) {
        updatedLoadedCalendarMonths[calendarSlug] = new Set();
      }
      updatedLoadedCalendarMonths[calendarSlug].add(yearMonth);

      return {
        calendarDays: updatedCalendarDays,
        loadedCalendarMonths: updatedLoadedCalendarMonths,
      };
    });
  },

  // 查詢方法
  getCalendar: (slug: string) => {
    const { calendars } = get();
    return calendars.find(cal => cal.slug === slug);
  },

  getCalendarDays: (calendarSlug: string, yearMonth: string) => {
    const { calendarDays } = get();
    return calendarDays[calendarSlug]?.[yearMonth] || [];
  },

  isCalendarMonthLoaded: (calendarSlug: string, yearMonth: string) => {
    const { loadedCalendarMonths } = get();
    return loadedCalendarMonths[calendarSlug]?.has(yearMonth) || false;
  },

  getLoadedMonthsForCalendar: (calendarSlug: string) => {
    const { loadedCalendarMonths } = get();
    return Array.from(loadedCalendarMonths[calendarSlug] || []);
  },

  // 狀態管理
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      calendars: [],
      pagination: null,
      calendarDays: {},
      isLoading: false,
      error: null,
      loadedCalendarMonths: {},
    }),
}));
