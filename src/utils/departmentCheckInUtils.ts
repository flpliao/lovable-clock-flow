
import { Department } from '@/components/departments/types';

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

// 驗證打卡位置是否在允許範圍內
export const validateCheckInLocation = (
  userLatitude: number,
  userLongitude: number,
  department: Department
): {
  isValid: boolean;
  distance: number;
  message: string;
} => {
  // 檢查部門是否有GPS座標
  if (!department.latitude || !department.longitude) {
    return {
      isValid: false,
      distance: -1,
      message: '部門尚未設定GPS座標，請聯繫管理員'
    };
  }
  
  // 計算距離
  const distance = calculateGPSDistance(
    userLatitude,
    userLongitude,
    department.latitude,
    department.longitude
  );
  
  // 檢查是否在允許範圍內
  const allowedRadius = department.check_in_radius || 100;
  const isValid = distance <= allowedRadius;
  
  console.log('📍 打卡位置驗證:', {
    userPosition: { lat: userLatitude, lng: userLongitude },
    departmentPosition: { lat: department.latitude, lng: department.longitude },
    distance,
    allowedRadius,
    isValid,
    departmentName: department.name
  });
  
  return {
    isValid,
    distance,
    message: isValid 
      ? `打卡成功 (距離部門 ${distance} 公尺)`
      : `超出打卡範圍 (距離部門 ${distance} 公尺，允許範圍 ${allowedRadius} 公尺)`
  };
};

// 根據員工部門獲取對應的GPS驗證座標
export const getDepartmentForCheckIn = (
  departments: Department[],
  employeeDepartment: string
): Department | null => {
  console.log('🔍 搜尋員工部門:', {
    employeeDepartment,
    availableDepartments: departments.map(d => d.name)
  });
  
  const department = departments.find(dept => dept.name === employeeDepartment);
  
  if (!department) {
    console.warn('⚠️ 找不到對應部門:', employeeDepartment);
    return null;
  }
  
  console.log('📋 找到部門資訊:', {
    name: department.name,
    hasGPS: !!(department.latitude && department.longitude),
    isVerified: department.address_verified,
    latitude: department.latitude,
    longitude: department.longitude
  });
  
  if (!department.address_verified || !department.latitude || !department.longitude) {
    console.warn('⚠️ 部門GPS座標尚未驗證或不存在:', {
      departmentName: department.name,
      hasCoordinates: !!(department.latitude && department.longitude),
      isVerified: department.address_verified
    });
    return null;
  }
  
  return department;
};
