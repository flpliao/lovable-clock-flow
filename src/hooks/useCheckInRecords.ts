import {
  getCheckInRecords,
  fetchMonthlyAttendance,
  AttendanceRecord,
} from '@/services/checkInService';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import { CheckInRecord } from '@/types/checkIn';
import { showError } from '@/utils/toast';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { format } from 'date-fns';
import { abnormalStatuses, realtimeStatuses } from '@/constants/attendanceStatus';
import dayjs from 'dayjs';

export const useCheckInRecords = () => {
  const {
    records,
    setRecords,
    addRecord,
    updateRecord,
    removeRecord,
    getRecordById,
    getRecordsByType,
    getRecordsByDate,
    getTodayRecords,
    getLatestRecord,
    hasCheckInToday,
    hasCheckOutToday,
    isCompletedToday,
    isLoading,
    setError,
    setLoading,
    error,
  } = useMyCheckInRecordsStore();

  // 月曆出勤資料相關狀態
  const [monthlyData, setMonthlyData] = useState<Record<string, AttendanceRecord> | null>(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  // 使用 ref 來避免依賴問題
  const monthlyLoadingRef = useRef(false);

  // 載入打卡記錄
  const loadCheckInRecords = async (checked_at?: string) => {
    if (isLoading) return;

    setLoading(true);
    setError(null);

    const targetDate = checked_at || dayjs().format('YYYY-MM-DD');
    try {
      const data = await getCheckInRecords(targetDate);
      setRecords(data);
    } catch (error) {
      setError(error.message);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 載入今日打卡記錄
  const loadTodayCheckInRecords = async () => {
    try {
      await loadCheckInRecords(dayjs().format('YYYY-MM-DD'));
    } catch (error) {
      showError(error.message);
    }
  };

  // 新增打卡記錄
  const handleAddCheckInRecord = (record: CheckInRecord) => {
    addRecord(record);
  };

  // 更新打卡記錄
  const handleUpdateCheckInRecord = (id: string, updates: Partial<CheckInRecord>) => {
    updateRecord(id, updates);
  };

  // 刪除打卡記錄
  const handleRemoveCheckInRecord = (id: string) => {
    removeRecord(id);
  };

  // 載入月曆出勤資料
  const loadMonthlyData = useCallback(async (year: number, month: number) => {
    if (monthlyLoadingRef.current) return;

    monthlyLoadingRef.current = true;
    setMonthlyLoading(true);
    setMonthlyError(null);

    try {
      const response = await fetchMonthlyAttendance(year, month);
      setMonthlyData(response.attendance_records);
    } catch (error) {
      console.error('載入月曆資料失敗:', error);
      setMonthlyError(error instanceof Error ? error.message : '載入月曆資料失敗');
    } finally {
      monthlyLoadingRef.current = false;
      setMonthlyLoading(false);
    }
  }, []);

  // 切換月份
  const changeMonth = useCallback(
    async (year: number, month: number) => {
      setCurrentYear(year);
      setCurrentMonth(month);
      await loadMonthlyData(year, month);
    },
    [loadMonthlyData]
  );

  // 取得特定日期的出勤記錄
  const getAttendanceForDate = useCallback(
    (date: Date): AttendanceRecord | null => {
      if (!monthlyData) return null;

      const dateStr = format(date, 'yyyy-MM-dd');
      return monthlyData[dateStr] || null;
    },
    [monthlyData]
  );

  // 取得選中日期的出勤記錄
  const selectedDateAttendance = useMemo(() => {
    if (!selectedDate) return null;
    return getAttendanceForDate(selectedDate);
  }, [selectedDate, getAttendanceForDate]);

  // 取得需要高亮的日期（有異常的日期，只對今天和過去日期）
  const getHighlightedDates = useCallback(() => {
    if (!monthlyData) return [];

    const highlightedDates: Date[] = [];
    const today = new Date();

    Object.entries(monthlyData).forEach(([dateStr, record]) => {
      const recordDate = new Date(dateStr);
      // 只對今天和過去日期顯示異常狀態
      if (
        recordDate <= today &&
        record.is_workday &&
        abnormalStatuses.includes(record.attendance_status)
      ) {
        highlightedDates.push(recordDate);
      }
    });

    return highlightedDates;
  }, [monthlyData]);

  // 取得未打卡的狀態
  const getMissedCheckInStatus = useCallback(() => {
    if (!monthlyData) return { missedCheckIn: false, missedCheckOut: false };

    const today = format(new Date(), 'yyyy-MM-dd');
    const todayRecord = monthlyData[today];

    if (!todayRecord || !todayRecord.is_workday) {
      return { missedCheckIn: false, missedCheckOut: false };
    }

    return {
      missedCheckIn: !todayRecord.check_in_time,
      missedCheckOut: !todayRecord.check_out_time,
    };
  }, [monthlyData]);

  // 初始化載入月曆資料
  useEffect(() => {
    loadMonthlyData(currentYear, currentMonth);
  }, [currentYear, currentMonth, loadMonthlyData]);

  // 今天的即時狀態更新
  useEffect(() => {
    if (!monthlyData) return;

    // 檢查是否有今天的記錄需要即時更新
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayRecord = monthlyData[todayStr];

    if (todayRecord && realtimeStatuses.includes(todayRecord.attendance_status)) {
      // 每分鐘檢查今天的狀態
      const interval = setInterval(() => {
        // 只重新載入今天的資料，而不是整個月份
        loadMonthlyData(currentYear, currentMonth);
      }, 60000); // 60秒

      return () => clearInterval(interval);
    }
  }, [monthlyData, currentYear, currentMonth, loadMonthlyData]);

  return {
    // 打卡記錄狀態
    records,
    isLoading,
    error,

    // 月曆出勤資料狀態
    monthlyData,
    currentYear,
    currentMonth,
    selectedDate,
    selectedDateAttendance,
    highlightedDates: getHighlightedDates(),
    missedCheckInStatus: getMissedCheckInStatus(),
    monthlyLoading,
    monthlyError,

    // 打卡記錄操作方法
    loadCheckInRecords,
    loadTodayCheckInRecords,
    handleAddCheckInRecord,
    handleUpdateCheckInRecord,
    handleRemoveCheckInRecord,

    // 月曆出勤資料操作方法
    loadMonthlyData,
    changeMonth,
    setSelectedDate,
    getAttendanceForDate,

    // 查詢方法
    getRecordById,
    getRecordsByType,
    getRecordsByDate,
    getTodayRecords,
    getLatestRecord,
    hasCheckInToday,
    hasCheckOutToday,
    isCompletedToday,
  };
};
