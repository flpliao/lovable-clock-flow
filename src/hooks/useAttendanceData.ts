import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAttendanceStore } from '@/stores/useAttendanceStore';
import { AttendanceRecord } from '@/services/attendanceService';
import { format } from 'date-fns';
import { abnormalStatuses, realtimeStatuses } from '@/constants/attendanceStatus';

export const useAttendanceData = () => {
  const {
    monthlyData,
    currentYear,
    currentMonth,
    checkInRecords,
    loading,
    error,
    fetchMonthlyData,
    fetchCheckInData,
    setCurrentMonth,
    clearError,
  } = useAttendanceStore();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 載入打卡記錄
  const loadCheckInData = useCallback(async () => {
    await fetchCheckInData();
  }, [fetchCheckInData]);

  // 切換月份
  const changeMonth = useCallback(
    async (year: number, month: number) => {
      setCurrentMonth(year, month);
      await fetchMonthlyData(year, month);
    },
    [setCurrentMonth, fetchMonthlyData]
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

  // 初始化載入
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchMonthlyData(currentYear, currentMonth), loadCheckInData()]);
    };
    loadData();
  }, [currentYear, currentMonth, fetchMonthlyData, loadCheckInData]);

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
        fetchMonthlyData(currentYear, currentMonth);
      }, 60000); // 60秒

      return () => clearInterval(interval);
    }
  }, [monthlyData, currentYear, currentMonth, fetchMonthlyData]);

  return {
    // 資料
    monthlyData,
    checkInRecords,
    selectedDate,
    selectedDateAttendance,
    highlightedDates: getHighlightedDates(),
    missedCheckInStatus: getMissedCheckInStatus(),

    // 狀態
    loading,
    error,
    currentYear,
    currentMonth,

    // 方法
    setSelectedDate,
    changeMonth,
    getAttendanceForDate,
    loadCheckInData,
    clearError,
    fetchMonthlyData,
  };
};
