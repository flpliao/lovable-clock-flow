import { getCheckInRecords, fetchMonthlyAttendance } from '@/services/checkInService';
import { AttendanceRecord } from '@/types/attendance';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import { CheckInRecord } from '@/types/checkIn';
import { showError } from '@/utils/toast';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { format } from 'date-fns';
import { realtimeStatuses } from '@/constants/attendanceStatus';
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
    monthlyLoading,
    monthlyError,
    setMonthlyData,
    getMonthlyData,
    hasMonthlyData,
    setMonthlyLoading,
    setMonthlyError,
  } = useMyCheckInRecordsStore();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const monthlyLoadingRef = useRef(false);
  const today = useMemo(() => new Date(), []);

  // 判斷某日是否為異常狀態
  const isAbnormalRecord = useCallback((record: AttendanceRecord) => {
    const hasValidCheckIn = record.check_in_records.some(
      r =>
        r.status === 'success' &&
        r.type === 'check_in' &&
        (!r.approval_status || r.approval_status === 'approved')
    );
    const hasValidCheckOut = record.check_in_records.some(
      r =>
        r.status === 'success' &&
        r.type === 'check_out' &&
        (!r.approval_status || r.approval_status === 'approved')
    );
    return record.is_late || record.is_early_leave || !(hasValidCheckIn && hasValidCheckOut);
  }, []);

  const loadCheckInRecords = useCallback(
    async (checked_at?: string) => {
      if (isLoading) return;
      setLoading(true);
      setError(null);

      const targetDate = checked_at || dayjs().format('YYYY-MM-DD');
      try {
        const data = await getCheckInRecords(targetDate);
        setRecords(data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '載入打卡記錄失敗';
        setError(msg);
        showError(msg);
      } finally {
        setLoading(false);
      }
    },
    [isLoading, setLoading, setError, setRecords]
  );

  const loadTodayCheckInRecords = useCallback(async () => {
    try {
      await loadCheckInRecords(dayjs().format('YYYY-MM-DD'));
    } catch (e) {
      showError(e instanceof Error ? e.message : '載入今日打卡記錄失敗');
    }
  }, [loadCheckInRecords]);

  const handleAddCheckInRecord = useCallback(
    (record: CheckInRecord) => addRecord(record),
    [addRecord]
  );
  const handleUpdateCheckInRecord = useCallback(
    (id: string, updates: Partial<CheckInRecord>) => updateRecord(id, updates),
    [updateRecord]
  );
  const handleRemoveCheckInRecord = useCallback((id: string) => removeRecord(id), [removeRecord]);

  const loadMonthlyData = useCallback(
    async (year: number, month: number) => {
      if (monthlyLoadingRef.current) return;
      if (hasMonthlyData(year, month)) return;

      monthlyLoadingRef.current = true;
      setMonthlyLoading(true);
      setMonthlyError(null);

      try {
        const response = await fetchMonthlyAttendance(year, month);
        setMonthlyData(year, month, response.attendance_records);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '載入月曆資料失敗';
        setMonthlyError(msg);
      } finally {
        monthlyLoadingRef.current = false;
        setMonthlyLoading(false);
      }
    },
    [hasMonthlyData, setMonthlyData, setMonthlyLoading, setMonthlyError]
  );

  const changeMonth = useCallback(
    async (year: number, month: number) => {
      setCurrentYear(year);
      setCurrentMonth(month);
      await loadMonthlyData(year, month);
    },
    [loadMonthlyData]
  );

  const getAttendanceForDate = useCallback(
    (date: Date): AttendanceRecord | null => {
      const currentMonthData = getMonthlyData(currentYear, currentMonth);
      if (!currentMonthData) return null;
      return currentMonthData[format(date, 'yyyy-MM-dd')] || null;
    },
    [currentYear, currentMonth, getMonthlyData]
  );

  const selectedDateAttendance = useMemo(() => {
    if (!selectedDate) return null;
    return getAttendanceForDate(selectedDate);
  }, [selectedDate, getAttendanceForDate]);

  const getHighlightedDates = useCallback(() => {
    const currentMonthData = getMonthlyData(currentYear, currentMonth);
    if (!currentMonthData) return { danger: [], warning: [] };

    const highlightedDates = { danger: [] as Date[], warning: [] as Date[] };

    Object.entries(currentMonthData).forEach(([dateStr, record]) => {
      const recordDate = new Date(dateStr);
      if (recordDate <= today && record.is_workday && isAbnormalRecord(record)) {
        if (record.check_in_records.some(r => r.approval_status === 'pending')) {
          highlightedDates.warning.push(recordDate);
        } else {
          highlightedDates.danger.push(recordDate);
        }
      }
    });
    return highlightedDates;
  }, [currentYear, currentMonth, getMonthlyData, isAbnormalRecord, today]);

  const getMissedCheckInStatus = useCallback(() => {
    const currentMonthData = getMonthlyData(currentYear, currentMonth);
    if (!currentMonthData) return { missedCheckIn: false, missedCheckOut: false };

    const todayStr = format(today, 'yyyy-MM-dd');
    const todayRecord = currentMonthData[todayStr];
    if (!todayRecord || !todayRecord.is_workday) {
      return { missedCheckIn: false, missedCheckOut: false };
    }
    return {
      missedCheckIn: !todayRecord.check_in_time,
      missedCheckOut: !todayRecord.check_out_time,
    };
  }, [currentYear, currentMonth, getMonthlyData, today]);

  useEffect(() => {
    loadMonthlyData(currentYear, currentMonth);
  }, [currentYear, currentMonth, loadMonthlyData]);

  useEffect(() => {
    const currentMonthData = getMonthlyData(currentYear, currentMonth);
    if (!currentMonthData) return;

    const todayStr = format(today, 'yyyy-MM-dd');
    const todayRecord = currentMonthData[todayStr];
    if (todayRecord && realtimeStatuses.includes(todayRecord.attendance_status)) {
      const interval = setInterval(() => {
        loadMonthlyData(currentYear, currentMonth);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [currentYear, currentMonth, getMonthlyData, loadMonthlyData, today]);

  return {
    records,
    isLoading,
    error,
    monthlyData: getMonthlyData(currentYear, currentMonth),
    currentYear,
    currentMonth,
    selectedDate,
    selectedDateAttendance,
    highlightedDates: getHighlightedDates(),
    missedCheckInStatus: getMissedCheckInStatus(),
    monthlyLoading,
    monthlyError,
    loadCheckInRecords,
    loadTodayCheckInRecords,
    handleAddCheckInRecord,
    handleUpdateCheckInRecord,
    handleRemoveCheckInRecord,
    loadMonthlyData,
    changeMonth,
    setSelectedDate,
    getAttendanceForDate,
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
