
import { Department } from '@/components/departments/types';
import { calculateDistance } from './gpsCalculations';

/**
 * 檢查員工是否在部門允許的打卡範圍內
 * @param userLat 用戶緯度
 * @param userLng 用戶經度
 * @param department 部門資料
 * @param systemDistanceLimit 系統設定的距離限制（公尺）
 * @returns 檢查結果
 */
export const isWithinCheckInRange = (
  userLat: number,
  userLng: number,
  department: Department,
  systemDistanceLimit: number
): {
  isWithinRange: boolean;
  distance: number;
  allowedDistance: number;
} => {
  if (!department.latitude || !department.longitude) {
    return {
      isWithinRange: false,
      distance: 0,
      allowedDistance: systemDistanceLimit
    };
  }
  
  const distance = calculateDistance(
    userLat,
    userLng,
    department.latitude,
    department.longitude
  );
  
  // 使用系統設定的距離限制，而不是部門的 check_in_radius
  const allowedDistance = systemDistanceLimit;
  const isWithinRange = distance <= allowedDistance;
  
  console.log('📍 打卡範圍檢查:', {
    departmentName: department.name,
    userPosition: { lat: userLat, lng: userLng },
    departmentPosition: { lat: department.latitude, lng: department.longitude },
    distance,
    allowedDistance,
    isWithinRange,
    systemDistanceLimit
  });
  
  return {
    isWithinRange,
    distance,
    allowedDistance
  };
};
