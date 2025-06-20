
import { Department } from '@/components/departments/types';
import { isDepartmentReadyForCheckIn } from './departmentValidation';

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
