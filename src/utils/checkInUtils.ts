
import { CheckInRecord } from '@/types';

// 公司位置 (假設為台北101)
const COMPANY_LOCATION = {
  latitude: 25.033671,
  longitude: 121.564427,
  name: "公司總部"
};

// 允許的打卡距離 (公尺)
const ALLOWED_DISTANCE = 100;

// 計算兩點間距離的函數
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371000; // 地球半徑（公尺）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// 取得當前位置的函數
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('瀏覽器不支援地理位置功能'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        let errorMessage = '無法取得位置資訊';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '位置權限被拒絕，請在瀏覽器設定中允許位置存取';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置資訊無法取得';
            break;
          case error.TIMEOUT:
            errorMessage = '位置請求逾時';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};

// 取得使用者 IP 位址的函數
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    throw new Error('無法取得 IP 位址');
  }
};

// 位置打卡的函數
export const handleLocationCheckIn = async (
  userId: string,
  actionType: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (error: string) => void,
  setDistance?: (distance: number) => void
) => {
  try {
    const position = await getCurrentPosition();
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;
    
    const distance = calculateDistance(
      userLat, 
      userLon, 
      COMPANY_LOCATION.latitude, 
      COMPANY_LOCATION.longitude
    );
    
    if (setDistance) {
      setDistance(distance);
    }
    
    if (distance > ALLOWED_DISTANCE) {
      onError(`您距離公司 ${Math.round(distance)} 公尺，超過允許範圍 ${ALLOWED_DISTANCE} 公尺`);
      return;
    }
    
    const record: CheckInRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      type: 'location',
      status: 'success',
      action: actionType,
      details: {
        latitude: userLat,
        longitude: userLon,
        distance,
        locationName: COMPANY_LOCATION.name
      }
    };
    
    onSuccess(record);
  } catch (error) {
    onError(error instanceof Error ? error.message : '位置打卡失敗');
  }
};

// IP 打卡的函數
export const handleIpCheckIn = async (
  userId: string,
  actionType: 'check-in' | 'check-out',
  onSuccess: (record: CheckInRecord) => void,
  onError: (error: string) => void
) => {
  try {
    const ip = await getUserIP();
    
    const record: CheckInRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      type: 'ip',
      status: 'success',
      action: actionType,
      details: {
        ip
      }
    };
    
    onSuccess(record);
  } catch (error) {
    onError(error instanceof Error ? error.message : 'IP 打卡失敗');
  }
};

// 格式化日期的函數
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 格式化時間的函數
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

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
