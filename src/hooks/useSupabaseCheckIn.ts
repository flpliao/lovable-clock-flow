
import { useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useCheckInRecords } from './useCheckInRecords';
import { useCheckInCreator } from './useCheckInCreator';
import { useTodayCheckInRecords } from './useTodayCheckInRecords';
import { CheckInRecord } from '@/types';
import { UserIdValidationService } from '@/services/userIdValidationService';

export const useSupabaseCheckIn = () => {
  const { currentUser } = useUser();
  const { checkInRecords, loading, loadCheckInRecords } = useCheckInRecords();
  const { createCheckInRecord: createRecord } = useCheckInCreator();
  const { getTodayCheckInRecords } = useTodayCheckInRecords();
  const initialLoadRef = useRef(false);

  const createCheckInRecord = async (record: Omit<CheckInRecord, 'id'>) => {
    if (!currentUser?.id) {
      console.error('無使用者 ID，無法建立打卡記錄');
      return false;
    }
    
    const validatedUserId = UserIdValidationService.validateUserId(currentUser.id);
    const success = await createRecord(record, validatedUserId);
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
    
    const validatedUserId = UserIdValidationService.validateUserId(targetUserId);
    return await getTodayCheckInRecords(validatedUserId);
  }, [currentUser?.id, getTodayCheckInRecords]);

  const refreshData = useCallback(async () => {
    if (currentUser?.id) {
      const validatedUserId = UserIdValidationService.validateUserId(currentUser.id);
      console.log('重新整理打卡資料，使用者 ID:', validatedUserId);
      try {
        await loadCheckInRecords(validatedUserId);
      } catch (error) {
        console.error('重新整理資料失敗:', error);
      }
    }
  }, [currentUser?.id, loadCheckInRecords]);

  // 手動載入記錄
  const manualLoadRecords = useCallback(async () => {
    if (currentUser?.id && !loading) {
      const validatedUserId = UserIdValidationService.validateUserId(currentUser.id);
      console.log('手動載入打卡記錄，使用者ID:', validatedUserId);
      await loadCheckInRecords(validatedUserId);
    }
  }, [currentUser?.id, loadCheckInRecords, loading]);

  return {
    checkInRecords,
    loading,
    createCheckInRecord,
    getTodayCheckInRecords: getTodayRecords,
    loadCheckInRecords: manualLoadRecords,
    refreshData
  };
};
