// checkInService: 提供打卡相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { CheckInMethod, CheckInSource, RequestType } from '@/constants/checkInTypes';
import { apiRoutes } from '@/routes/api';
import { CheckInRecord, CreateCheckInPayload } from '@/types/checkIn';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { getCurrentIp, getCurrentPosition } from '@/utils/location';
import dayjs from 'dayjs';

// 出勤資料快取服務
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // 存活時間（毫秒）
}

class AttendanceCache {
  private cache = new Map<string, CacheItem<unknown>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5分鐘預設快取時間

  // 設定快取
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // 取得快取
  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    // 檢查是否過期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  // 清除快取
  clear(): void {
    this.cache.clear();
  }

  // 清除特定快取
  delete(key: string): void {
    this.cache.delete(key);
  }

  // 生成快取鍵
  generateKey(prefix: string, ...params: (string | number)[]): string {
    return `${prefix}:${params.join(':')}`;
  }
}

export const attendanceCache = new AttendanceCache();

// 出勤記錄介面
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
  check_in_records: CheckInRecord[];
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

// 打卡參數介面
export interface CheckInParams {
  type: RequestType.CHECK_IN | RequestType.CHECK_OUT;
  method: CheckInMethod;
  selectedCheckpoint?: {
    latitude: number;
    longitude: number;
    check_in_radius: number;
    name: string;
  };
}

export const getTodayCheckInRecords = async () => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params: { created_at: dayjs().format('YYYY-MM-DD') },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入打卡記錄失敗: ${message}`);
  }

  return splitCheckInRecords(data as CheckInRecord[]);
};

// 前端分組
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === RequestType.CHECK_IN);
  const checkOut = records.find(r => r.type === RequestType.CHECK_OUT);
  return { [RequestType.CHECK_IN]: checkIn, [RequestType.CHECK_OUT]: checkOut };
};

// 取得打卡記錄
export const getCheckInRecords = async (checked_at?: string): Promise<CheckInRecord[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params: checked_at ? { checked_at } : {},
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入打卡記錄失敗: ${message}`);
  }

  return data as CheckInRecord[];
};

// 建立打卡紀錄
export const createCheckInRecord = async (checkInData: CreateCheckInPayload) => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立打卡記錄失敗: ${message}`);
  }

  return data as CheckInRecord;
};

// 打卡
export const checkIn = async (checkInData: {
  latitude: number;
  longitude: number;
  type: 'in' | 'out';
}): Promise<CheckInRecord> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`打卡失敗: ${message}`);
  }

  return data as CheckInRecord;
};

// 統一的打卡記錄建立函數
export const createCheckInRecordByMethod = async (
  params: CheckInParams
): Promise<CheckInRecord> => {
  const { type, method, selectedCheckpoint } = params;

  // 位置打卡需要選擇打卡點
  if (method === CheckInMethod.LOCATION && !selectedCheckpoint) {
    throw new Error('請先選擇打卡地點');
  }

  const ip = await getCurrentIp();
  const { latitude, longitude } = await getCurrentPosition();

  const checkInData: CreateCheckInPayload = {
    type,
    source: CheckInSource.NORMAL,
    method: method,
    latitude,
    longitude,
    ip_address: ip,
  };

  return await createCheckInRecord(checkInData);
};

// 向後相容的函數別名
export const createIpCheckInRecord = async (
  type: RequestType.CHECK_IN | RequestType.CHECK_OUT
): Promise<CheckInRecord> => {
  return createCheckInRecordByMethod({ type, method: CheckInMethod.IP });
};

export const createLocationCheckInRecord = async (
  params: Omit<CheckInParams, 'method'> & {
    selectedCheckpoint: NonNullable<CheckInParams['selectedCheckpoint']>;
  }
): Promise<CheckInRecord> => {
  return createCheckInRecordByMethod({
    ...params,
    method: CheckInMethod.LOCATION,
  });
};

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
export const fetchCheckInRecords = async (): Promise<CheckInRecord[]> => {
  const cacheKey = attendanceCache.generateKey('checkin');

  // 檢查快取
  const cachedData = attendanceCache.get<CheckInRecord[]>(cacheKey);
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
