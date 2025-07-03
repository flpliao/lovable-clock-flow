import { useCurrentUser } from '@/hooks/useStores';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { CheckInRecord } from '@/types';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useAttendanceRecords = () => {
  // 使用新的 Zustand hooks
  const currentUser = useCurrentUser();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateRecords, setSelectedDateRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});
  const { checkInRecords, loadCheckInRecords, refreshData } = useSupabaseCheckIn();
  const initialLoadRef = useRef(false);

  // 穩定化 loadRecords 函數
  const loadRecords = useCallback(async () => {
    if (currentUser?.id && !initialLoadRef.current) {
      try {
        console.log('PersonalAttendance - 初次載入打卡記錄，使用者ID:', currentUser.id);
        initialLoadRef.current = true;
        await loadCheckInRecords();
      } catch (error) {
        console.error('載入打卡記錄失敗:', error);
        // 不顯示錯誤提示，只記錄到控制台
      }
    }
  }, [currentUser?.id, loadCheckInRecords]);

  // 載入打卡記錄 - 只在初次載入時執行
  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // 當使用者改變時重置初始載入標記
  useEffect(() => {
    initialLoadRef.current = false;
  }, [currentUser?.id]);

  // 根據選擇的日期過濾打卡記錄
  useEffect(() => {
    console.log('過濾打卡記錄 - 選擇日期:', date, '記錄數量:', checkInRecords.length);
    
    if (date && checkInRecords.length > 0) {
      try {
        const selectedDateStr = format(date, 'yyyy-MM-dd');
        console.log('選擇的日期字串:', selectedDateStr);
        
        const dayRecords = checkInRecords.filter(record => {
          const recordDate = format(new Date(record.timestamp), 'yyyy-MM-dd');
          const isMatch = recordDate === selectedDateStr && record.status === 'success';
          console.log(`記錄 ${record.id}: ${recordDate} === ${selectedDateStr} && ${record.status} === success = ${isMatch}`);
          return isMatch;
        });
        
        console.log('當日記錄:', dayRecords);
        
        const checkIn = dayRecords.find(record => record.action === 'check-in');
        const checkOut = dayRecords.find(record => record.action === 'check-out');
        
        console.log('找到的記錄:', { checkIn, checkOut });
        
        setSelectedDateRecords({ checkIn, checkOut });
      } catch (error) {
        console.error('過濾記錄時發生錯誤:', error);
        setSelectedDateRecords({});
      }
    } else {
      console.log('沒有日期或記錄，清空選擇的記錄');
      setSelectedDateRecords({});
    }
  }, [date, checkInRecords]);

  return {
    date,
    setDate,
    selectedDateRecords,
    checkInRecords,
    refreshData
  };
};
