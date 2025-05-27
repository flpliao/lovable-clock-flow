
import { CheckInRecord } from '@/types';
import { getCurrentPosition, calculateDistance, COMPANY_LOCATION, ALLOWED_DISTANCE } from './geolocation';
import { getUserIP } from './networkUtils';

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
    
    console.log('位置打卡距離計算:', {
      userPosition: { lat: userLat, lon: userLon },
      companyPosition: { lat: COMPANY_LOCATION.latitude, lon: COMPANY_LOCATION.longitude },
      calculatedDistance: distance,
      allowedDistance: ALLOWED_DISTANCE
    });
    
    // 檢查是否為管理員（簡單的開發模式檢查）
    const isAdmin = userId === '550e8400-e29b-41d4-a716-446655440001'; // 廖俊雄的ID
    
    if (distance > ALLOWED_DISTANCE && !isAdmin) {
      onError(`您距離公司 ${Math.round(distance)} 公尺，超過允許範圍 ${ALLOWED_DISTANCE} 公尺`);
      return;
    }
    
    // 如果是管理員且超過距離，給予警告但允許打卡
    if (distance > ALLOWED_DISTANCE && isAdmin) {
      console.warn(`管理員模式：允許遠距離打卡 (${Math.round(distance)} 公尺)`);
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
        distance: Math.round(distance), // 確保轉換為整數
        locationName: COMPANY_LOCATION.name
      }
    };
    
    console.log('產生的打卡記錄:', record);
    onSuccess(record);
  } catch (error) {
    console.error('位置打卡失敗:', error);
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
    console.log('取得 IP 位址:', ip);
    
    const record: CheckInRecord = {
      id: Date.now().toString(),
      userId,
      timestamp: new Date().toISOString(),
      type: 'ip',
      status: 'success',
      action: actionType,
      details: {
        ip,
        locationName: 'IP遠端打卡' // 確保有位置名稱
      }
    };
    
    console.log('產生的IP打卡記錄:', record);
    onSuccess(record);
  } catch (error) {
    console.error('IP 打卡失敗:', error);
    onError(error instanceof Error ? error.message : 'IP 打卡失敗');
  }
};
