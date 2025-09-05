import { apiRoutes } from '@/routes';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { attendanceCache } from './attendanceCache';

export interface AttendanceRecord {
  date: string;
  is_workday: boolean;
  work_schedule: {
    id: number;
    shift: {
      code: string;
      name: string;
      color: string;
    };
    clock_in_time: string;
    clock_out_time: string;
  } | null;
  attendance_status:
    | 'normal'
    | 'late'
    | 'early_leave'
    | 'absent'
    | 'incomplete'
    | 'abnormal'
    | 'off'
    | 'scheduled'
    | 'pending'
    | 'in_progress';
  check_in_time: string | null;
  check_out_time: string | null;
  is_late: boolean;
  is_early_leave: boolean;
  work_hours: number;
  overtime_hours: number;
}

export interface MonthlyAttendanceResponse {
  year: number;
  month: number;
  attendance_records: Record<string, AttendanceRecord>;
}

export interface ApiCheckInRecord {
  id: number;
  employee_id: number;
  type: 'check_in' | 'check_out';
  status: 'success' | 'failed';
  latitude: string;
  longitude: string;
  distance: number | null;
  ip_address: string;
  method: 'ip' | 'location';
  location_name: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * 取得特定月出勤紀錄（月曆格式）
 */
export const fetchMonthlyAttendance = async (
  year: number,
  month: number
): Promise<MonthlyAttendanceResponse> => {
  const cacheKey = attendanceCache.generateKey('monthly', year, month);

  // 檢查快取
  const cachedData = attendanceCache.get<MonthlyAttendanceResponse>(cacheKey);
  if (cachedData) {
    console.log('使用快取的月曆資料');
    return cachedData;
  }

  const { data } = await axiosWithEmployeeAuth().get(apiRoutes.checkin.monthlyAttendance, {
    params: { year, month },
  });

  const result = data.data;

  // 快取資料（5分鐘）
  attendanceCache.set(cacheKey, result, 5 * 60 * 1000);

  return result;
};

/**
 * 取得員工打卡紀錄
 */
export const fetchCheckInRecords = async (): Promise<ApiCheckInRecord[]> => {
  const cacheKey = attendanceCache.generateKey('checkin');

  // 檢查快取
  const cachedData = attendanceCache.get<ApiCheckInRecord[]>(cacheKey);
  if (cachedData) {
    console.log('使用快取的打卡記錄');
    return cachedData;
  }

  const { data } = await axiosWithEmployeeAuth().get(apiRoutes.checkin.index);
  const result = data.data;

  // 快取資料（2分鐘）
  attendanceCache.set(cacheKey, result, 2 * 60 * 1000);

  return result;
};

/**
 * 清除月曆快取
 */
export const clearMonthlyCache = (year: number, month: number): void => {
  const cacheKey = attendanceCache.generateKey('monthly', year, month);
  attendanceCache.delete(cacheKey);
  console.log('清除月曆快取:', cacheKey);
};

/**
 * 清除所有快取
 */
export const clearAllCache = (): void => {
  attendanceCache.clear();
  console.log('清除所有快取');
};
