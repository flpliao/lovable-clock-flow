
import { Department } from '@/components/departments/types';
import { SystemSettingsService } from '@/services/systemSettingsService';

// 計算兩個GPS座標之間的距離（單位：公尺）
export const calculateGPSDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371e3; // 地球半徑（公尺）
  const φ1 = lat1 * Math.PI / 180; // φ, λ 以弧度為單位
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const distance = R * c; // 距離（公尺）
  
  return Math.round(distance);
};

// 驗證打卡位置是否在允許範圍內 - 支援動態距離限制
export const validateCheckInLocation = async (
  userLatitude: number,
  userLongitude: number,
  department: Department
): Promise<{
  isValid: boolean;
  distance: number;
  message: string;
  gpsStatus: string;
}> => {
  console.log('📍 開始GPS打卡驗證:', {
    userPosition: { lat: userLatitude, lng: userLongitude },
    department: {
      name: department.name,
      gpsStatus: department.gps_status,
      hasCoordinates: !!(department.latitude && department.longitude),
      coordinates: department.latitude ? { lat: department.latitude, lng: department.longitude } : null
    }
  });

  // 檢查部門GPS狀態
  if (department.gps_status !== 'converted') {
    return {
      isValid: false,
      distance: -1,
      message: '部門尚未設定GPS座標，請聯繫管理者設定',
      gpsStatus: department.gps_status || 'not_converted'
    };
  }
  
  // 檢查部門是否有GPS座標
  if (!department.latitude || !department.longitude) {
    return {
      isValid: false,
      distance: -1,
      message: '部門GPS座標資料不完整，請聯繫管理者重新設定',
      gpsStatus: 'incomplete'
    };
  }
  
  // 計算距離
  const distance = calculateGPSDistance(
    userLatitude,
    userLongitude,
    department.latitude,
    department.longitude
  );
  
  // 取得系統設定的打卡距離限制
  const systemDistanceLimit = await SystemSettingsService.getCheckInDistanceLimit();
  const allowedRadius = department.check_in_radius || systemDistanceLimit;
  const isValid = distance <= allowedRadius;
  
  console.log('✅ 打卡位置驗證完成:', {
    userPosition: { lat: userLatitude, lng: userLongitude },
    departmentPosition: { lat: department.latitude, lng: department.longitude },
    distance,
    allowedRadius,
    systemDistanceLimit,
    isValid,
    departmentName: department.name,
    gpsStatus: 'converted'
  });
  
  return {
    isValid,
    distance,
    gpsStatus: 'converted',
    message: isValid 
      ? `打卡成功 (距離${department.name} ${distance} 公尺)`
      : `您距離${department.name}太遠（${distance} 公尺），超過允許範圍 ${allowedRadius} 公尺，無法打卡`
  };
};

// 同步版本的驗證函數，使用預設值
export const validateCheckInLocationSync = (
  userLatitude: number,
  userLongitude: number,
  department: Department
): {
  isValid: boolean;
  distance: number;
  message: string;
  gpsStatus: string;
} => {
  console.log('📍 開始GPS打卡驗證 (同步版本):', {
    userPosition: { lat: userLatitude, lng: userLongitude },
    department: {
      name: department.name,
      gpsStatus: department.gps_status,
      hasCoordinates: !!(department.latitude && department.longitude),
      coordinates: department.latitude ? { lat: department.latitude, lng: department.longitude } : null
    }
  });

  // 檢查部門GPS狀態
  if (department.gps_status !== 'converted') {
    return {
      isValid: false,
      distance: -1,
      message: '部門尚未設定GPS座標，請聯繫管理者設定',
      gpsStatus: department.gps_status || 'not_converted'
    };
  }
  
  // 檢查部門是否有GPS座標
  if (!department.latitude || !department.longitude) {
    return {
      isValid: false,
      distance: -1,
      message: '部門GPS座標資料不完整，請聯繫管理者重新設定',
      gpsStatus: 'incomplete'
    };
  }
  
  // 計算距離
  const distance = calculateGPSDistance(
    userLatitude,
    userLongitude,
    department.latitude,
    department.longitude
  );
  
  // 使用部門設定的半徑，如果沒有則使用500公尺預設值
  const allowedRadius = department.check_in_radius || 500;
  const isValid = distance <= allowedRadius;
  
  console.log('✅ 打卡位置驗證完成 (同步版本):', {
    userPosition: { lat: userLatitude, lng: userLongitude },
    departmentPosition: { lat: department.latitude, lng: department.longitude },
    distance,
    allowedRadius,
    isValid,
    departmentName: department.name,
    gpsStatus: 'converted'
  });
  
  return {
    isValid,
    distance,
    gpsStatus: 'converted',
    message: isValid 
      ? `打卡成功 (距離${department.name} ${distance} 公尺)`
      : `您距離${department.name}太遠（${distance} 公尺），超過允許範圍 ${allowedRadius} 公尺，無法打卡`
  };
};

// 根據員工部門獲取對應的GPS驗證座標
export const getDepartmentForCheckIn = (
  departments: Department[],
  employeeDepartment: string
): Department | null => {
  console.log('🔍 搜尋員工部門GPS設定:', {
    employeeDepartment,
    availableDepartments: departments.map(d => ({ 
      name: d.name, 
      gpsStatus: d.gps_status,
      hasGPS: !!(d.latitude && d.longitude)
    }))
  });
  
  const department = departments.find(dept => dept.name === employeeDepartment);
  
  if (!department) {
    console.warn('⚠️ 找不到對應部門:', employeeDepartment);
    return null;
  }
  
  console.log('📋 找到部門資訊:', {
    name: department.name,
    gpsStatus: department.gps_status,
    hasGPS: !!(department.latitude && department.longitude),
    isReadyForCheckIn: department.gps_status === 'converted' && department.latitude && department.longitude,
    coordinates: department.latitude ? {
      latitude: department.latitude,
      longitude: department.longitude,
      radius: department.check_in_radius
    } : null
  });
  
  return department;
};

// 檢查部門是否可用於打卡
export const isDepartmentReadyForCheckIn = (department: Department): boolean => {
  return department.gps_status === 'converted' && 
         !!department.latitude && 
         !!department.longitude;
};

// 取得部門GPS狀態說明
export const getDepartmentGPSStatusMessage = (department: Department): string => {
  switch (department.gps_status) {
    case 'converted':
      return '部門GPS已設定，可正常打卡';
    case 'failed':
      return 'GPS轉換失敗，請聯繫管理者重新設定';
    default:
      return '部門尚未設定GPS座標，請聯繫管理者';
  }
};
