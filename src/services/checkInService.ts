// checkInService: 提供打卡相關 API 操作
import { CheckInType, METHOD_IP, METHOD_LOCATION } from '@/constants/checkInTypes';
import { API_ROUTES } from '@/routes';
import { CheckInRecord } from '@/types';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import dayjs from 'dayjs';

// 取得今日打卡紀錄
export const getTodayCheckInRecords = async () => {
  const data = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${API_ROUTES.CHECKIN.INDEX}`, {
      params: { created_at: dayjs().format('YYYY-MM-DD') },
    })
  );

  return splitCheckInRecords(data as CheckInRecord[]);
};

// 前端分組
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  if (!records) return { checkIn: null, checkOut: null };

  const checkIn = records.find(r => r.type === 'check_in');
  const checkOut = records.find(r => r.type === 'check_out');
  return { checkIn, checkOut };
};

export const getCheckInRecords = async () => {
  const response = await axiosWithEmployeeAuth().get(`${API_ROUTES.CHECKIN.INDEX}`, {});
  return response.data;
};

// 建立打卡紀錄
export const createCheckInRecord = async (checkInData: CheckInRecord) => {
  const response = await axiosWithEmployeeAuth().post(`${API_ROUTES.CHECKIN.CREATE}`, checkInData);
  return response.data;
};

// 計算兩點之間的距離
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

// 建立 employee 版本的 IP 打卡紀錄
export const createIpCheckInRecord = async (type: CheckInType) => {
  // 取得IP位址
  const ipResponse = await fetch('https://api.ipify.org?format=json');
  const ipData = await ipResponse.json();
  const checkInData: CheckInRecord = {
    type: type,
    method: METHOD_IP,
    status: 'success',
    distance: 0,
    latitude: 0,
    longitude: 0,
    ip_address: ipData.ip,
  };

  const response = await createCheckInRecord(checkInData);
  return response.data;
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

  // 取得地理位置
  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const { latitude, longitude } = position.coords;

  // 計算距離
  const dist = getDistance(
    latitude,
    longitude,
    selectedCheckpoint.latitude,
    selectedCheckpoint.longitude
  );

  // 距離限制檢查
  if (dist > selectedCheckpoint.check_in_radius) {
    throw new Error(
      `距離 ${selectedCheckpoint.name} 過遠 (${dist}公尺)，請移動到${selectedCheckpoint.name}附近再進行打卡`
    );
  }

  // 儲存打卡記錄
  const checkInData: CheckInRecord = {
    type: type,
    method: METHOD_LOCATION,
    status: 'success',
    distance: dist,
    latitude,
    longitude,
    ip_address: '127.0.0.1',
  };

  const response = await createCheckInRecord(checkInData);
  return response.data;
};
