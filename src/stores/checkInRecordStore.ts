import { CheckInRecord } from '@/types/checkIn';
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
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === date;
    });
  },

  getRecordsByDateRange: (startDate, endDate) => {
    const { records } = get();
    return records.filter(record => {
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate >= startDate && recordDate <= endDate;
    });
  },

  getTodayRecords: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.filter(record => {
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === today;
    });
  },

  getLatestRecord: () => {
    const { records } = get();
    if (records.length === 0) return undefined;

    return records.reduce((latest, current) => {
      const latestTime = new Date(latest.created_at || '').getTime();
      const currentTime = new Date(current.created_at || '').getTime();
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

  // 狀態管理
  setRecords: (records: CheckInRecord[]) => void;
  addRecord: (record: CheckInRecord) => void;
  updateRecord: (id: string, updates: Partial<CheckInRecord>) => void;
  removeRecord: (id: string) => void;

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
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === date;
    });
  },

  getTodayRecords: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.filter(record => {
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === today;
    });
  },

  getLatestRecord: () => {
    const { records } = get();
    if (records.length === 0) return undefined;

    return records.reduce((latest, current) => {
      const latestTime = new Date(latest.created_at || '').getTime();
      const currentTime = new Date(current.created_at || '').getTime();
      return currentTime > latestTime ? current : latest;
    });
  },

  hasCheckInToday: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.some(record => {
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === today && record.type === 'check_in';
    });
  },

  hasCheckOutToday: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    return records.some(record => {
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === today && record.type === 'check_out';
    });
  },

  isCompletedToday: () => {
    const { records } = get();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = records.filter(record => {
      const recordDate = new Date(record.created_at || '').toISOString().split('T')[0];
      return recordDate === today;
    });

    const hasCheckIn = todayRecords.some(record => record.type === 'check_in');
    const hasCheckOut = todayRecords.some(record => record.type === 'check_out');

    return hasCheckIn && hasCheckOut;
  },

  // 狀態控制
  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  reset: () => set({ records: [], isLoading: false, error: null }),
}));
