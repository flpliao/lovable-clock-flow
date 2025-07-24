// checkInService: 提供打卡相關 API 操作
import { CheckInType, METHOD_IP, METHOD_LOCATION } from '@/constants/checkInTypes';
import { API_ROUTES } from '@/routes';
import { CheckInRecord } from '@/types/checkIn';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { getCurrentIp, getCurrentPosition } from '@/utils/location';
import dayjs from 'dayjs';

// 取得今日打卡紀錄
export const getTodayCheckInRecords = async () => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${API_ROUTES.CHECKIN.INDEX}`, {
      params: { created_at: dayjs().format('YYYY-MM-DD') },
    })
  );

  if (status === 'error') {
    return { checkIn: null, checkOut: null };
  }

  return splitCheckInRecords(data as CheckInRecord[]);
};

// 前端分組
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === 'check_in');
  const checkOut = records.find(r => r.type === 'check_out');
  return { checkIn, checkOut };
};

export const getCheckInRecords = async () => {
  const { data } = await axiosWithEmployeeAuth().get(`${API_ROUTES.CHECKIN.INDEX}`, {});
  return data as CheckInRecord[];
};

// 建立打卡紀錄
export const createCheckInRecord = async (checkInData: CheckInRecord) => {
  const { data } = await axiosWithEmployeeAuth().post(`${API_ROUTES.CHECKIN.CREATE}`, checkInData);
  return data;
};

// 建立 employee 版本的 IP 打卡紀錄
export const createIpCheckInRecord = async (type: CheckInType) => {
  // 取得IP位址
  const ip = await getCurrentIp();
  const checkInData: CheckInRecord = {
    type: type,
    method: METHOD_IP,
    status: 'success',
    distance: 0,
    latitude: 0,
    longitude: 0,
    ip_address: ip,
  };

  const { data } = await createCheckInRecord(checkInData);
  return data;
};

// 位置打卡處理邏輯
export interface LocationCheckInParams {
  type: CheckInType;
  selectedCheckpoint: {
    latitude: number;
    longitude: number;
    check_in_radius: number;
    name: string;
  };
}

export const createLocationCheckInRecord = async (
  params: LocationCheckInParams
): Promise<CheckInRecord> => {
  const { type, selectedCheckpoint } = params;

  // 取得比對目標
  if (!selectedCheckpoint) {
    throw new Error('請先選擇打卡地點');
  }

  const { latitude, longitude } = await getCurrentPosition();

  const checkInData: CheckInRecord = {
    type: type,
    method: METHOD_LOCATION,
    status: 'success',
    latitude,
    longitude,
    ip_address: '127.0.0.1',
  };

  const { data } = await createCheckInRecord(checkInData);
  return data;
};
