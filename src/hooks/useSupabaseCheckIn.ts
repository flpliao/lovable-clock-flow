
import { useEffect } from 'react';
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
    if (!currentUser?.id) return false;
    
    const success = await createRecord(record, currentUser.id);
    if (success) {
      await loadCheckInRecords(currentUser.id);
    }
    return success;
  };

  const getTodayRecords = async (userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) return { checkIn: undefined, checkOut: undefined };
    
    return await getTodayCheckInRecords(targetUserId);
  };

  const refreshData = async () => {
    if (currentUser?.id) {
      await loadCheckInRecords(currentUser.id);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      console.log('useEffect 觸發載入記錄，使用者ID:', currentUser.id);
      loadCheckInRecords(currentUser.id);
    }
  }, [currentUser?.id]);

  return {
    checkInRecords,
    loading,
    createCheckInRecord,
    getTodayCheckInRecords: getTodayRecords,
    loadCheckInRecords: refreshData,
    refreshData
  };
};
