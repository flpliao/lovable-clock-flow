// checkInService: 提供打卡相關 API 操作
import {
  CHECK_IN,
  CHECK_OUT,
  CheckInType,
  METHOD_IP,
  METHOD_LOCATION,
} from '@/constants/checkInTypes';
import { apiRoutes } from '@/routes/api';
import { CheckInRecord } from '@/types/checkIn';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { getCurrentIp, getCurrentPosition } from '@/utils/location';
import dayjs from 'dayjs';

export const getTodayCheckInRecords = async () => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params: { created_at: dayjs().format('YYYY-MM-DD') },
    })
  );

  if (status === 'error') {
    return { [CHECK_IN]: null, [CHECK_OUT]: null };
  }

  return splitCheckInRecords(data as CheckInRecord[]);
};

// 前端分組
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === CHECK_IN);
  const checkOut = records.find(r => r.type === CHECK_OUT);
  return { [CHECK_IN]: checkIn, [CHECK_OUT]: checkOut };
};

// 取得打卡記錄
export const getCheckInRecords = async (date?: string): Promise<CheckInRecord[]> => {
  try {
    const params = date ? { date } : {};
    const response = await axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('獲取打卡記錄失敗:', error);
    throw new Error('獲取打卡記錄失敗');
  }
};

// 建立打卡紀錄
export const createCheckInRecord = async (checkInData: CheckInRecord) => {
  const { data } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );
  return data as CheckInRecord;
};

// 打卡
export const checkIn = async (checkInData: {
  latitude: number;
  longitude: number;
  type: 'in' | 'out';
}): Promise<CheckInRecord> => {
  try {
    const response = await axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData);
    return response.data;
  } catch (error) {
    console.error('打卡失敗:', error);
    throw new Error('打卡失敗');
  }
};

// 打卡參數介面
export interface CheckInParams {
  type: CheckInType;
  method: 'ip' | 'location';
  selectedCheckpoint?: {
    latitude: number;
    longitude: number;
    check_in_radius: number;
    name: string;
  };
}

// 統一的打卡記錄建立函數
export const createCheckInRecordByMethod = async (
  params: CheckInParams
): Promise<CheckInRecord> => {
  const { type, method, selectedCheckpoint } = params;

  // 位置打卡需要選擇打卡點
  if (method === METHOD_LOCATION && !selectedCheckpoint) {
    throw new Error('請先選擇打卡地點');
  }

  const ip = await getCurrentIp();
  const { latitude, longitude } = await getCurrentPosition();

  const checkInData: CheckInRecord = {
    type,
    method: method,
    latitude,
    longitude,
    ip_address: ip,
  };

  return await createCheckInRecord(checkInData);
};

// 向後相容的函數別名
export const createIpCheckInRecord = async (type: CheckInType): Promise<CheckInRecord> => {
  return createCheckInRecordByMethod({ type, method: METHOD_IP });
};

export const createLocationCheckInRecord = async (
  params: Omit<CheckInParams, 'method'> & {
    selectedCheckpoint: NonNullable<CheckInParams['selectedCheckpoint']>;
  }
): Promise<CheckInRecord> => {
  return createCheckInRecordByMethod({ ...params, method: METHOD_LOCATION });
};
