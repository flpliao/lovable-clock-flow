// checkInService: 提供打卡相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { CheckInMethod, CheckInSource, RequestType } from '@/constants/checkInTypes';
import { apiRoutes } from '@/routes/api';
import { CheckInRecord, CreateCheckInPayload } from '@/types/checkIn';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { getCurrentIp, getCurrentPosition } from '@/utils/location';
import dayjs from 'dayjs';

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

// 今日打卡記錄
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

// 分組打卡記錄
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === RequestType.CHECK_IN);
  const checkOut = records.find(r => r.type === RequestType.CHECK_OUT);
  return {
    [RequestType.CHECK_IN]: checkIn,
    [RequestType.CHECK_OUT]: checkOut,
  };
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

  if (method === CheckInMethod.LOCATION && !selectedCheckpoint) {
    throw new Error('請先選擇打卡地點');
  }

  const ip = await getCurrentIp();
  const { latitude, longitude } = await getCurrentPosition();

  const checkInData: CreateCheckInPayload = {
    type,
    source: CheckInSource.NORMAL,
    method,
    latitude,
    longitude,
    ip_address: ip,
  };

  return await createCheckInRecord(checkInData);
};

// IP 打卡
export const createIpCheckInRecord = async (
  type: RequestType.CHECK_IN | RequestType.CHECK_OUT
): Promise<CheckInRecord> => createCheckInRecordByMethod({ type, method: CheckInMethod.IP });

// 定位打卡
export const createLocationCheckInRecord = async (
  params: Omit<CheckInParams, 'method'> & {
    selectedCheckpoint: NonNullable<CheckInParams['selectedCheckpoint']>;
  }
): Promise<CheckInRecord> =>
  createCheckInRecordByMethod({
    ...params,
    method: CheckInMethod.LOCATION,
  });

// 取得員工打卡紀錄
export const fetchCheckInRecords = async (): Promise<CheckInRecord[]> => {
  const { data } = await axiosWithEmployeeAuth().get(apiRoutes.checkin.index);
  return data.data;
};

// 取得指定日期範圍的打卡記錄
export const getCheckInRecordsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<CheckInRecord[]> => {
  const { data } = await axiosWithEmployeeAuth().get(apiRoutes.checkin.index, {
    params: {
      all: true,
      start_date: startDate,
      end_date: endDate,
    },
  });
  return data.data;
};
