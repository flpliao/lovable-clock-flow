
import { useEffect, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useCheckInRecords } from './useCheckInRecords';
import { useCheckInCreator } from './useCheckInCreator';
import { useTodayCheckInRecords } from './useTodayCheckInRecords';
import { CheckInRecord } from '@/types';

export const useSupabaseCheckIn = () => {
  const { currentUser } = useUser();
  const { checkInRecords, loading, loadCheckInRecords } = useCheckInRecords();
  const { createCheckInRecord: createRecord } = useCheckInCreator();
  const { getTodayCheckInRecords } = useTodayCheckInRecords();

  const createCheckInRecord = async (record: Omit<CheckInRecord, 'id'>) => {
    if (!currentUser?.id) {
      console.error('無使用者 ID，無法建立打卡記錄');
      return false;
    }
    
    const success = await createRecord(record, currentUser.id);
    if (success) {
      // 重新載入記錄
      await refreshData();
    }
    return success;
  };

  const getTodayRecords = useCallback(async (userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      console.log('無目標使用者 ID');
      return { checkIn: undefined, checkOut: undefined };
    }
    
    return await getTodayCheckInRecords(targetUserId);
  }, [currentUser?.id, getTodayCheckInRecords]);

  const refreshData = useCallback(async () => {
    if (currentUser?.id) {
      console.log('重新整理打卡資料，使用者 ID:', currentUser.id);
      await loadCheckInRecords(currentUser.id);
    }
  }, [currentUser?.id, loadCheckInRecords]);

  // 初始載入
  useEffect(() => {
    if (currentUser?.id) {
      console.log('useEffect 觸發載入記錄，使用者ID:', currentUser.id);
      loadCheckInRecords(currentUser.id);
    }
  }, [currentUser?.id, loadCheckInRecords]);

  return {
    checkInRecords,
    loading,
    createCheckInRecord,
    getTodayCheckInRecords: getTodayRecords,
    loadCheckInRecords: refreshData,
    refreshData
  };
};
