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

  // 載入狀態
  isLoading: boolean;
  error: string | null;

  // 基本操作方法
  setCalendars: (calendars: CalendarItem[], pagination?: CalendarPagination | null) => void;
  addCalendar: (calendar: CalendarItem) => void;
  updateCalendar: (slug: string, updates: Partial<CalendarItem>) => void;
  removeCalendar: (slug: string) => void;

  // 查詢方法
  getCalendar: (slug: string) => CalendarItem | undefined;
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
  isLoading: false,
  error: null,

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
    }));
  },

  // 查詢方法
  getCalendar: (slug: string) => {
    const { calendars } = get();
    return calendars.find(cal => cal.slug === slug);
  },

  getCalendarDays: (calendarSlug: string) => {
    const { calendars } = get();
    const calendar = calendars.find(cal => cal.slug === calendarSlug);
    return calendar?.calendar_days || [];
  },

  updateCalendarDays: (calendarSlug: string, days: CalendarDayItem[]) => {
    set(state => ({
      calendars: state.calendars.map(cal =>
        cal.slug === calendarSlug ? { ...cal, calendar_days: days } : cal
      ),
    }));
  },

  // 狀態管理
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      calendars: [],
      pagination: null,
      isLoading: false,
      error: null,
    }),
}));
