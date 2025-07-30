import { Dayjs } from 'dayjs';

/**
 * 計算兩個日期時間之間的小時差
 * @param startDateTime 開始日期時間
 * @param endDateTime 結束日期時間
 * @returns 小時數（向上取整）
 */
export const calculateHoursBetween = (startDateTime: Dayjs, endDateTime: Dayjs): number => {
  return Math.ceil(endDateTime.diff(startDateTime, 'hour', true)); // 使用 dayjs 計算小時差並向上取整
};
