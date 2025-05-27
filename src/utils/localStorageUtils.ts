
import { CheckInRecord } from '@/types';

// 取得使用者打卡記錄（暫時保留本地存儲邏輯以便向後兼容）
export const getUserCheckInRecords = (userId: string): CheckInRecord[] => {
  const records = localStorage.getItem(`checkInRecords_${userId}`);
  return records ? JSON.parse(records) : [];
};

// Export alias for backward compatibility
export const getCheckInRecords = (): CheckInRecord[] => {
  // Return all records from localStorage for all users
  const allRecords: CheckInRecord[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('checkInRecords_')) {
      const records = localStorage.getItem(key);
      if (records) {
        allRecords.push(...JSON.parse(records));
      }
    }
  }
  return allRecords;
};

// 取得使用者今日打卡記錄（暫時保留本地存儲邏輯以便向後兼容）
export const getUserTodayRecords = (userId: string): { checkIn?: CheckInRecord, checkOut?: CheckInRecord } => {
  const allRecords = getUserCheckInRecords(userId);
  const today = new Date().toDateString();
  
  const todayRecords = allRecords.filter(record => 
    new Date(record.timestamp).toDateString() === today && record.status === 'success'
  );
  
  const checkIn = todayRecords.find(record => record.action === 'check-in');
  const checkOut = todayRecords.find(record => record.action === 'check-out');
  
  return { checkIn, checkOut };
};

// 儲存打卡記錄到本地存儲（暫時保留以便向後兼容）
export const saveCheckInRecord = (userId: string, record: CheckInRecord): void => {
  const existingRecords = getUserCheckInRecords(userId);
  const updatedRecords = [record, ...existingRecords];
  localStorage.setItem(`checkInRecords_${userId}`, JSON.stringify(updatedRecords));
};
