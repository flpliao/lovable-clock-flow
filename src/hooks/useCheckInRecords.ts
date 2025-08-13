import { getCheckInRecords } from '@/services/checkInService';
import { useMyCheckInRecordsStore } from '@/stores/checkInRecordStore';
import { CheckInRecord } from '@/types/checkIn';
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

  // 載入打卡記錄
  const loadCheckInRecords = async (created_at?: string) => {
    if (isLoading) return;

    setLoading(true);
    setError(null);

    const targetDate = created_at || dayjs().format('YYYY-MM-DD');
    const data = await getCheckInRecords(targetDate);
    setRecords(data);

    setLoading(false);
  };

  // 載入今日打卡記錄
  const loadTodayCheckInRecords = async () => {
    await loadCheckInRecords(dayjs().format('YYYY-MM-DD'));
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

  return {
    // 狀態
    records,
    isLoading,
    error,

    // 操作方法
    loadCheckInRecords,
    loadTodayCheckInRecords,
    handleAddCheckInRecord,
    handleUpdateCheckInRecord,
    handleRemoveCheckInRecord,

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
