import dayjs, { Dayjs } from 'dayjs';

/**
 * 計算兩個日期時間之間的小時差
 * @param startDateTime 開始日期時間
 * @param endDateTime 結束日期時間
 * @returns 小時數（向上取整）
 */
export const calculateHoursBetween = (startDateTime: Dayjs, endDateTime: Dayjs): number => {
  return Math.ceil(endDateTime.diff(startDateTime, 'hour', true)); // 使用 dayjs 計算小時差並向上取整
};

/**
 * 計算實際加班開始時間
 * @param clockOutTime 下班時間 (格式: HH:MM)
 * @param hours 延遲小時數
 * @param minutes 延遲分鐘數
 * @returns 實際加班開始時間 (格式: HH:MM)
 */
export const calculateOvertimeStartTime = (
  clockOutTime: string,
  hours: number,
  minutes: number
): string => {
  if (!clockOutTime) return '';

  // 使用 dayjs 解析下班時間
  const [outHours, outMinutes] = clockOutTime.split(':').map(Number);
  const clockOutDateTime = dayjs().hour(outHours).minute(outMinutes).second(0);

  // 加上延遲時間
  const overtimeStartDateTime = clockOutDateTime.add(hours, 'hour').add(minutes, 'minute');

  // 格式化為 HH:MM
  return overtimeStartDateTime.format('HH:mm');
};

/**
 * 格式化純時間字串 - 將 "HH:MM:SS" 或 "HH:MM" 格式化為 "HH:MM"
 * @param timeString 時間字串 (格式: "HH:MM:SS" 或 "HH:MM")
 * @returns 格式化後的時間字串 (格式: "HH:MM")
 */
export const formatTimeString = (timeString: string): string => {
  if (!timeString) return '';

  // 如果已經是 HH:MM 格式，直接返回
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }

  // 如果是 HH:MM:SS 格式，取前5個字符
  if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return timeString.substring(0, 5);
  }

  // 嘗試使用 dayjs 解析
  const timeObj = dayjs(timeString);
  if (timeObj.isValid()) {
    return timeObj.format('HH:mm');
  }

  return timeString;
};
