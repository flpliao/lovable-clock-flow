// checkInService: 提供打卡相關 API 操作
import {
  CHECK_IN,
  CHECK_OUT,
  CheckInType,
  METHOD_IP,
  METHOD_LOCATION,
} from '@/constants/checkInTypes';
import { apiRoutes } from '@/routes/api';
import { ApiResponseStatus } from '@/types/api';
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

  return status === ApiResponseStatus.SUCCESS
    ? splitCheckInRecords(data as CheckInRecord[])
    : { [CHECK_IN]: null, [CHECK_OUT]: null };
};

// 前端分組
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === CHECK_IN);
  const checkOut = records.find(r => r.type === CHECK_OUT);
  return { [CHECK_IN]: checkIn, [CHECK_OUT]: checkOut };
};

// 取得打卡記錄
export const getCheckInRecords = async (date?: string): Promise<CheckInRecord[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params: date ? { date } : {},
    })
  );
  return status === ApiResponseStatus.SUCCESS ? (data as CheckInRecord[]) : [];
};

// 建立打卡紀錄
export const createCheckInRecord = async (checkInData: CheckInRecord) => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as CheckInRecord) : null;
};

// 打卡
export const checkIn = async (checkInData: {
  latitude: number;
  longitude: number;
  type: 'in' | 'out';
}): Promise<CheckInRecord> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as CheckInRecord) : null;
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
