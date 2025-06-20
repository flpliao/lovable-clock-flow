
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseCheckIn } from './useSupabaseCheckIn';
import { CheckInRecord } from '@/types';

export const useCheckInTodayRecords = (userId: string) => {
  const [todayRecords, setTodayRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});

  const { getTodayCheckInRecords } = useSupabaseCheckIn();

  // 載入今日打卡記錄
  const loadTodayRecords = useCallback(async () => {
    if (!userId) return;
    
    try {
      const records = await getTodayCheckInRecords(userId);
      setTodayRecords(records);
      console.log('📅 今日打卡記錄:', records);
    } catch (error) {
      console.error('載入今日打卡記錄失敗:', error);
    }
  }, [userId, getTodayCheckInRecords]);

  // 初始載入
  useEffect(() => {
    loadTodayRecords();
  }, [loadTodayRecords]);

  // 判斷當前應該進行的動作類型
  const actionType: 'check-in' | 'check-out' = todayRecords.checkIn && !todayRecords.checkOut ? 'check-out' : 'check-in';

  return {
    todayRecords,
    actionType,
    loadTodayRecords
  };
};
