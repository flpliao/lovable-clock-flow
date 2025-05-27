
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
