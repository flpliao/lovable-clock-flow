import { Department } from '@/components/departments/types';

/**
 * 檢查部門是否準備好進行打卡
 * @param department 部門資料
 * @returns 是否準備好進行打卡
 */
export const isDepartmentReadyForCheckIn = (department: Department): boolean => {
  // 檢查是否有GPS座標
  const hasGPSCoordinates =
    department.latitude !== null &&
    department.longitude !== null &&
    department.latitude !== undefined &&
    department.longitude !== undefined;

  // 檢查GPS狀態是否為已轉換
  const hasValidGPSStatus = department.gps_status === 'converted';

  // 檢查地址是否已驗證
  const isAddressVerified = department.address_verified === true;

  // Debug logging - only in development mode
  // eslint-disable-next-line no-undef
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('🔍 部門打卡準備檢查:', {
      departmentName: department.name,
      hasGPSCoordinates,
      hasValidGPSStatus,
      isAddressVerified,
      gpsStatus: department.gps_status,
      coordinates: { lat: department.latitude, lng: department.longitude },
    });
  }

  return hasGPSCoordinates && hasValidGPSStatus && isAddressVerified;
};

/**
 * 驗證打卡位置是否在允許範圍內（同步版本）
 * @param userLat 用戶緯度
 * @param userLng 用戶經度
 * @param department 部門資料
 * @returns 驗證結果
 */
export const validateCheckInLocationSync = (
  userLat: number,
  userLng: number,
  department: Department
): {
  isValid: boolean;
  distance: number;
  message: string;
  gpsStatus: string;
} => {
  if (!department.latitude || !department.longitude) {
    return {
      isValid: false,
      distance: 0,
      message: '部門GPS座標未設定',
      gpsStatus: 'no_coordinates',
    };
  }

  const distance = calculateDistance(userLat, userLng, department.latitude, department.longitude);
  const allowedRadius = department.check_in_radius || 500;
  const isValid = distance <= allowedRadius;

  return {
    isValid,
    distance,
    message: isValid
      ? `位置驗證成功，距離 ${distance} 公尺`
      : `距離過遠 (${distance} 公尺)，超過允許範圍 ${allowedRadius} 公尺`,
    gpsStatus: 'valid',
  };
};

// Import the calculateDistance function
import { calculateDistance } from './gpsCalculations';
