// checkInService: 提供打卡相關 API 操作
import { API_ROUTES } from '@/routes';
import { CheckInRecord } from '@/types';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import dayjs from 'dayjs';

// 取得今日打卡紀錄
export const getTodayCheckInRecords = async () => {
  const response = await axiosWithEmployeeAuth().get(`${API_ROUTES.CHECKIN.INDEX}`, {
    params: { created_at: dayjs().toISOString() },
  });
  const records = response.data;
  return splitCheckInRecords(records);
};

// 前端分組
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === 'check-in');
  const checkOut = records.find(r => r.type === 'check-out');
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
export const createEmployeeIpCheckInRecord = async (type: 'check-in' | 'check-out') => {
  // 取得IP位址
  const ipResponse = await fetch('https://api.ipify.org?format=json');
  const ipData = await ipResponse.json();
  const checkInData: CheckInRecord = {
    type: type,
    status: 'success',
    distance: 0,
    latitude: 0,
    longitude: 0,
    ip_address: ipData.ip,
  };

  return await createCheckInRecord(checkInData);
};
