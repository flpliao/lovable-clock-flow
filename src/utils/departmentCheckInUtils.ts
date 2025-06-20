
import { Department } from '@/components/departments/types';

/**
 * 檢查部門是否準備好進行打卡
 * @param department 部門資料
 * @returns 是否準備好進行打卡
 */
export const isDepartmentReadyForCheckIn = (department: Department): boolean => {
  // 檢查是否有GPS座標
  const hasGPSCoordinates = department.latitude !== null && 
                           department.longitude !== null && 
                           department.latitude !== undefined && 
                           department.longitude !== undefined;
  
  // 檢查GPS狀態是否為已轉換
  const hasValidGPSStatus = department.gps_status === 'converted';
  
  // 檢查地址是否已驗證
  const isAddressVerified = department.address_verified === true;
  
  console.log('🔍 部門打卡準備檢查:', {
    departmentName: department.name,
    hasGPSCoordinates,
    hasValidGPSStatus,
    isAddressVerified,
    gpsStatus: department.gps_status,
    coordinates: { lat: department.latitude, lng: department.longitude }
  });
  
  return hasGPSCoordinates && hasValidGPSStatus && isAddressVerified;
};

/**
 * 計算兩個GPS座標之間的距離（公尺）
 * @param lat1 第一個座標的緯度
 * @param lng1 第一個座標的經度
 * @param lat2 第二個座標的緯度
 * @param lng2 第二個座標的經度
 * @returns 距離（公尺）
 */
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371000; // 地球半徑（公尺）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance);
};

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

/**
 * 取得部門打卡資訊摘要
 * @param department 部門資料
 * @param systemDistanceLimit 系統設定的距離限制
 * @returns 打卡資訊摘要
 */
export const getDepartmentCheckInInfo = (
  department: Department,
  systemDistanceLimit: number
): {
  isReady: boolean;
  statusText: string;
  allowedDistance: number;
} => {
  const isReady = isDepartmentReadyForCheckIn(department);
  let statusText = '';
  
  if (!department.location) {
    statusText = '未設定地址';
  } else if (department.gps_status === 'not_converted') {
    statusText = '未轉換GPS座標';
  } else if (department.gps_status === 'failed') {
    statusText = 'GPS轉換失敗';
  } else if (department.gps_status === 'converted' && isReady) {
    statusText = '可進行打卡';
  } else {
    statusText = '設定不完整';
  }
  
  return {
    isReady,
    statusText,
    allowedDistance: systemDistanceLimit // 使用系統設定的距離限制
  };
};

/**
 * 取得部門GPS狀態訊息
 * @param department 部門資料
 * @returns GPS狀態訊息
 */
export const getDepartmentGPSStatusMessage = (department: Department): string => {
  if (!department.location) {
    return '請先設定部門地址';
  }
  
  switch (department.gps_status) {
    case 'not_converted':
      return '尚未轉換GPS座標，請點擊轉換按鈕';
    case 'converted':
      return department.latitude && department.longitude 
        ? `GPS座標已設定 (${department.latitude.toFixed(6)}, ${department.longitude.toFixed(6)})`
        : 'GPS座標轉換已完成但座標資料不完整';
    case 'failed':
      return 'GPS座標轉換失敗，請檢查地址格式或重試';
    default:
      return '未知的GPS狀態';
  }
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
      gpsStatus: 'no_coordinates'
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
    gpsStatus: 'valid'
  };
};

/**
 * 取得用於打卡的部門資料
 * @param departments 部門列表
 * @param departmentName 部門名稱
 * @returns 符合的部門資料
 */
export const getDepartmentForCheckIn = (
  departments: Department[],
  departmentName: string
): Department | null => {
  return departments.find(dept => dept.name === departmentName) || null;
};
