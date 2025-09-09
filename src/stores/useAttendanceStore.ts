import { create } from 'zustand';
import {
  AttendanceRecord,
  fetchMonthlyAttendance,
  fetchCheckInRecords,
  clearMonthlyCache,
} from '@/services/attendanceService';
import { CheckInRecord } from '@/types';

interface AttendanceState {
  // 月曆資料
  monthlyData: Record<string, AttendanceRecord> | null;
  currentYear: number;
  currentMonth: number;

  // 打卡記錄
  checkInRecords: CheckInRecord[];

  // 載入狀態
  loading: boolean;
  error: string | null;

  // 防重複請求
  isFetchingMonthly: boolean;
  isFetchingCheckIn: boolean;

  // Actions
  fetchMonthlyData: (year: number, month: number) => Promise<void>;
  fetchCheckInData: () => Promise<void>;
  setCurrentMonth: (year: number, month: number) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => ({
  // 初始狀態
  monthlyData: null,
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth() + 1,
  checkInRecords: [],
  loading: false,
  error: null,
  isFetchingMonthly: false,
  isFetchingCheckIn: false,

  // 取得月曆資料
  fetchMonthlyData: async (year: number, month: number) => {
    const state = get();

    // 防重複請求
    if (state.isFetchingMonthly) {
      console.log('月曆資料正在載入中，跳過重複請求');
      return;
    }

    set({
      loading: true,
      error: null,
      isFetchingMonthly: true,
    });

    try {
      // 清除舊的快取
      if (state.currentYear !== year || state.currentMonth !== month) {
        clearMonthlyCache(state.currentYear, state.currentMonth);
      }

      const response = await fetchMonthlyAttendance(year, month);
      set({
        monthlyData: response.attendance_records,
        loading: false,
        isFetchingMonthly: false,
      });
    } catch (error) {
      console.error('載入月曆資料失敗:', error);
      set({
        error: error instanceof Error ? error.message : '載入月曆資料失敗',
        loading: false,
        isFetchingMonthly: false,
      });
    }
  },

  // 取得打卡記錄
  fetchCheckInData: async () => {
    const state = get();

    // 防重複請求
    if (state.isFetchingCheckIn) {
      console.log('打卡記錄正在載入中，跳過重複請求');
      return;
    }

    set({
      loading: true,
      error: null,
      isFetchingCheckIn: true,
    });

    try {
      const records = await fetchCheckInRecords();
      set({
        checkInRecords: records,
        loading: false,
        isFetchingCheckIn: false,
      });
    } catch (error) {
      console.error('載入打卡記錄失敗:', error);
      set({
        error: error instanceof Error ? error.message : '載入打卡記錄失敗',
        loading: false,
        isFetchingCheckIn: false,
      });
    }
  },

  // 設定當前月份
  setCurrentMonth: (year: number, month: number) => {
    set({ currentYear: year, currentMonth: month });
  },

  // 清除錯誤
  clearError: () => {
    set({ error: null });
  },

  // 重置狀態
  reset: () => {
    set({
      monthlyData: null,
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      checkInRecords: [],
      loading: false,
      error: null,
      isFetchingMonthly: false,
      isFetchingCheckIn: false,
    });
  },
}));
