
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { CheckInRecord } from '@/types';

export const useAttendanceRecords = () => {
  const { currentUser } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDateRecords, setSelectedDateRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});
  const { checkInRecords, loadCheckInRecords, refreshData } = useSupabaseCheckIn();

  // 載入打卡記錄 - 加入錯誤處理
  useEffect(() => {
    const loadRecords = async () => {
      if (currentUser?.id) {
        try {
          console.log('PersonalAttendance - 載入打卡記錄，使用者ID:', currentUser.id);
          await loadCheckInRecords();
        } catch (error) {
          console.error('載入打卡記錄失敗:', error);
          // 不顯示錯誤提示，只記錄到控制台
        }
      }
    };

    loadRecords();
  }, [currentUser?.id, loadCheckInRecords]);

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
