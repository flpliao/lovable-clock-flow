import { CheckInRecord } from '@/types/checkIn';
import { AttendanceRecord } from '@/types/attendance';
import dayjs from 'dayjs';
import { create } from 'zustand';

// 打卡記錄 Store
interface CheckInRecordState {
  records: CheckInRecord[];
  isLoading: boolean;
  error: string | null;

  // 狀態管理
  setRecords: (records: CheckInRecord[]) => void;
  addRecord: (record: CheckInRecord) => void;
  updateRecord: (id: string, updates: Partial<CheckInRecord>) => void;
  removeRecord: (id: string) => void;

  // 查詢方法
  getRecordById: (id: string) => CheckInRecord | undefined;
  getRecordsByType: (type: string) => CheckInRecord[];
  getRecordsByDate: (created_at: string) => CheckInRecord[];
  getRecordsByDateRange: (startDate: string, endDate: string) => CheckInRecord[];
  getTodayRecords: () => CheckInRecord[];
  getLatestRecord: () => CheckInRecord | undefined;
  getRecordCounts: () => { total: number; byType: Record<string, number> };

  // 狀態控制
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useCheckInRecordStore = create<CheckInRecordState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,

  // 狀態管理
  setRecords: records => set({ records }),

  addRecord: record => {
    const { records } = get();
    // 檢查是否已存在相同 ID 的記錄，如果存在則更新，否則新增
    const existingIndex = records.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      set({
        records: records.map((r, index) => (index === existingIndex ? { ...r, ...record } : r)),
      });
    } else {
      set({ records: [...records, record] });
    }
  },

  updateRecord: (id, updates) => {
    const { records } = get();
    set({
      records: records.map(record => (record.id === id ? { ...record, ...updates } : record)),
    });
  },

  removeRecord: id => {
    const { records } = get();
    set({ records: records.filter(record => record.id !== id) });
  },

  // 查詢方法
  getRecordById: id => {
    const { records } = get();
    return records.find(record => record.id === id);
  },

  getRecordsByType: type => {
    const { records } = get();
    return records.filter(record => record.type === type);
  },

  getRecordsByDate: date => {
    const { records } = get();
    return records.filter(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === date;
    });
  },

  getRecordsByDateRange: (startDate, endDate) => {
    const { records } = get();
    return records.filter(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate >= startDate && recordDate <= endDate;
    });
  },

  getTodayRecords: () => {
    const { records } = get();
    const today = dayjs().format('YYYY-MM-DD');
    return records.filter(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === today;
    });
  },

  getLatestRecord: () => {
    const { records } = get();
    if (records.length === 0) return undefined;

    return records.reduce((latest, current) => {
      const latestTime = dayjs(latest.checked_at).valueOf();
      const currentTime = dayjs(current.checked_at).valueOf();
      return currentTime > latestTime ? current : latest;
    });
  },

  getRecordCounts: () => {
    const { records } = get();
    const byType = records.reduce(
      (acc, record) => {
        acc[record.type] = (acc[record.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return { total: records.length, byType };
  },

  // 狀態控制
  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  reset: () => set({ records: [], isLoading: false, error: null }),
}));

// 我的打卡記錄 Store (員工視角)
interface MyCheckInRecordsState {
  records: CheckInRecord[];
  isLoading: boolean;
  error: string | null;

  // 月曆出勤資料 - 三層結構：年 -> 月 -> 日
  monthlyData: Record<number, Record<number, Record<string, AttendanceRecord>>>; // year -> month -> date
  monthlyLoading: boolean;
  monthlyError: string | null;

  // 狀態管理
  setRecords: (records: CheckInRecord[]) => void;
  addRecord: (record: CheckInRecord) => void;
  updateRecord: (id: string, updates: Partial<CheckInRecord>) => void;
  removeRecord: (id: string) => void;

  // 月曆資料管理
  setMonthlyData: (year: number, month: number, data: Record<string, AttendanceRecord>) => void;
  getMonthlyData: (year: number, month: number) => Record<string, AttendanceRecord> | null;
  getAttendanceForDate: (date: Date) => AttendanceRecord | null;
  hasMonthlyData: (year: number, month: number) => boolean;
  setMonthlyLoading: (loading: boolean) => void;
  setMonthlyError: (error: string | null) => void;

  // 查詢方法
  getRecordById: (id: string) => CheckInRecord | undefined;
  getRecordsByType: (type: string) => CheckInRecord[];
  getRecordsByDate: (date: string) => CheckInRecord[];
  getTodayRecords: () => CheckInRecord[];
  getLatestRecord: () => CheckInRecord | undefined;
  hasCheckInToday: () => boolean;
  hasCheckOutToday: () => boolean;
  isCompletedToday: () => boolean;

  // 狀態控制
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMyCheckInRecordsStore = create<MyCheckInRecordsState>((set, get) => ({
  records: [],
  isLoading: false,
  error: null,
  monthlyData: {},
  monthlyLoading: false,
  monthlyError: null,

  // 狀態管理
  setRecords: records => set({ records }),

  addRecord: record => {
    const { records } = get();
    // 檢查是否已存在相同 ID 的記錄，如果存在則更新，否則新增
    const existingIndex = records.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      set({
        records: records.map((r, index) => (index === existingIndex ? { ...r, ...record } : r)),
      });
    } else {
      set({ records: [...records, record] });
    }
  },

  updateRecord: (id, updates) => {
    const { records } = get();
    set({
      records: records.map(record => (record.id === id ? { ...record, ...updates } : record)),
    });
  },

  removeRecord: id => {
    const { records } = get();
    set({ records: records.filter(record => record.id !== id) });
  },

  // 查詢方法
  getRecordById: id => {
    const { records } = get();
    return records.find(record => record.id === id);
  },

  getRecordsByType: type => {
    const { records } = get();
    return records.filter(record => record.type === type);
  },

  getRecordsByDate: date => {
    const { records } = get();
    return records.filter(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === date;
    });
  },

  getTodayRecords: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.filter(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === today;
    });
  },

  getLatestRecord: () => {
    const { records } = get();
    if (records.length === 0) return undefined;

    return records.reduce((latest, current) => {
      const latestTime = dayjs(latest.checked_at).valueOf();
      const currentTime = dayjs(current.checked_at).valueOf();
      return currentTime > latestTime ? current : latest;
    });
  },

  hasCheckInToday: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.some(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === today && record.type === 'check_in';
    });
  },

  hasCheckOutToday: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.some(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === today && record.type === 'check_out';
    });
  },

  isCompletedToday: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(record => {
      const recordDate = dayjs(record.checked_at).format('YYYY-MM-DD');
      return recordDate === today;
    });

    const hasCheckIn = todayRecords.some(record => record.type === 'check_in');
    const hasCheckOut = todayRecords.some(record => record.type === 'check_out');

    return hasCheckIn && hasCheckOut;
  },

  // 月曆資料管理
  setMonthlyData: (year, month, data) => {
    set(state => ({
      monthlyData: {
        ...state.monthlyData,
        [year]: {
          ...state.monthlyData[year],
          [month]: data,
        },
      },
    }));
  },

  getMonthlyData: (year, month) => {
    const { monthlyData } = get();
    return monthlyData[year]?.[month] || null;
  },

  getAttendanceForDate: date => {
    const { monthlyData } = get();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript 月份從 0 開始
    const dateStr = dayjs(date).format('YYYY-MM-DD');

    return monthlyData[year]?.[month]?.[dateStr] || null;
  },

  hasMonthlyData: (year, month) => {
    const { monthlyData } = get();
    return !!monthlyData[year]?.[month];
  },

  setMonthlyLoading: loading => set({ monthlyLoading: loading }),

  setMonthlyError: error => set({ monthlyError: error }),

  // 狀態控制
  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  reset: () =>
    set({
      records: [],
      isLoading: false,
      error: null,
      monthlyData: {},
      monthlyLoading: false,
      monthlyError: null,
    }),
}));
