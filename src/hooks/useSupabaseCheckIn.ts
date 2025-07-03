import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';
import { useCallback, useEffect, useRef } from 'react';
import { useCheckInCreator } from './useCheckInCreator';
import { useCheckInRecords } from './useCheckInRecords';
import { useTodayCheckInRecords } from './useTodayCheckInRecords';

export const useSupabaseCheckIn = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();
  
  const { checkInRecords, loading, loadCheckInRecords } = useCheckInRecords();
  const { createCheckInRecord: createRecord } = useCheckInCreator();
  const { getTodayCheckInRecords } = useTodayCheckInRecords();
  const initialLoadRef = useRef(false);

  const validateAndGetStaffId = useCallback(async (userId: string) => {
    try {
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('id, user_id, name')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error validating staff:', error);
        return null;
      }

      if (!staffData) {
        console.error('No staff record found for user:', userId);
        return null;
      }

      console.log('驗證成功 - 員工資料:', staffData);
      return staffData.id;
    } catch (error) {
      console.error('Staff validation failed:', error);
      return null;
    }
  }, []);

  const createCheckInRecord = useCallback(async (record: Omit<CheckInRecord, 'id'>) => {
    if (!currentUser?.id) {
      console.error('無使用者 ID，無法建立打卡記錄');
      return false;
    }
    
    try {
      // 先驗證用戶是否存在於 staff 表中
      const staffId = await validateAndGetStaffId(currentUser.id);
      
      if (!staffId) {
        console.error('用戶驗證失敗，無法建立打卡記錄');
        return false;
      }

      const success = await createRecord(record, currentUser.id);
      if (success) {
        // 重新載入記錄
        await refreshData();
      }
      return success;
    } catch (error) {
      console.error('建立打卡記錄失敗:', error);
      return false;
    }
  }, [currentUser?.id, createRecord, validateAndGetStaffId]);

  const getTodayRecords = useCallback(async (userId?: string) => {
    const targetUserId = userId || currentUser?.id;
    if (!targetUserId) {
      console.log('無目標使用者 ID');
      return { checkIn: undefined, checkOut: undefined };
    }
    
    try {
      // 先驗證用戶
      const staffId = await validateAndGetStaffId(targetUserId);
      if (!staffId) {
        console.error('用戶驗證失敗');
        return { checkIn: undefined, checkOut: undefined };
      }

      return await getTodayCheckInRecords(targetUserId);
    } catch (error) {
      console.error('取得今日記錄失敗:', error);
      return { checkIn: undefined, checkOut: undefined };
    }
  }, [currentUser?.id, getTodayCheckInRecords, validateAndGetStaffId]);

  const refreshData = useCallback(async () => {
    if (currentUser?.id) {
      try {
        // 先驗證用戶
        const staffId = await validateAndGetStaffId(currentUser.id);
        if (!staffId) {
          console.error('用戶驗證失敗，無法重新整理資料');
          return;
        }

        console.log('重新整理打卡資料，使用者 ID:', currentUser.id);
        await loadCheckInRecords(currentUser.id);
      } catch (error) {
        console.error('重新整理資料失敗:', error);
        // 不顯示用戶錯誤提示，只記錄到控制台
      }
    }
  }, [currentUser?.id, loadCheckInRecords, validateAndGetStaffId]);

  // 手動載入記錄 - 加強錯誤處理
  const manualLoadRecords = useCallback(async () => {
    if (currentUser?.id && !loading && !initialLoadRef.current) {
      try {
        // 先驗證用戶
        const staffId = await validateAndGetStaffId(currentUser.id);
        if (!staffId) {
          console.error('用戶驗證失敗，無法載入記錄');
          return;
        }

        console.log('手動載入打卡記錄，使用者ID:', currentUser.id);
        initialLoadRef.current = true;
        await loadCheckInRecords(currentUser.id);
      } catch (error) {
        console.error('手動載入記錄失敗:', error);
        // 不顯示用戶錯誤提示，只記錄到控制台
      }
    }
  }, [currentUser?.id, loadCheckInRecords, loading, validateAndGetStaffId]);

  // 當使用者改變時重置初始載入標記
  useEffect(() => {
    initialLoadRef.current = false;
  }, [currentUser?.id]);

  return {
    checkInRecords,
    loading,
    createCheckInRecord,
    getTodayCheckInRecords: getTodayRecords,
    loadCheckInRecords: manualLoadRecords,
    refreshData
  };
};
