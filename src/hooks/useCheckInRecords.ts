import { getCheckInRecords } from '@/services/checkInService';
import { useMyCheckInRecordsStore } from '@/stores/myCheckInRecordsStore';
import { CheckInRecord } from '@/types/checkIn';
import { showError } from '@/utils/toast';
import dayjs from 'dayjs';
import { useCallback } from 'react';

export const useCheckInRecords = () => {
  const {
    records,
    setRecords,
    addRecord,
    getRecordsByDate,
    isLoading,
    setError,
    setLoading,
    error,
  } = useMyCheckInRecordsStore();

  const loadCheckInRecords = async (checked_at?: string) => {
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
  };

  const loadTodayCheckInRecords = async () => {
    const today = dayjs().format('YYYY-MM-DD');

    // 檢查今天是否已有打卡記錄
    const todayRecords = getRecordsByDate(today);
    if (todayRecords.length > 0) {
      return;
    }

    try {
      await loadCheckInRecords(today);
    } catch (e) {
      showError(e instanceof Error ? e.message : '載入今日打卡記錄失敗');
    }
  };

  const handleAddCheckInRecord = useCallback(
    (record: CheckInRecord) => addRecord(record),
    [addRecord]
  );

  return {
    records,
    isLoading,
    error,
    loadTodayCheckInRecords,
    handleAddCheckInRecord,
  };
};
