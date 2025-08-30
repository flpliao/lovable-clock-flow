import dayjs, { Dayjs } from 'dayjs';
import { WorkSchedule } from '@/types/workSchedule';

/**
 * 獲取指定日期的班表時間
 */
export interface ScheduleTime {
  clockInTime: string | null;
  clockOutTime: string | null;
}

/**
 * 從班表中獲取指定日期的上班和下班時間
 * @param date 日期字串 (YYYY-MM-DD)
 * @param workSchedules 工作班表陣列
 * @returns 包含上班和下班時間的物件
 */
export const getScheduleTimeForDate = (
  date: string,
  workSchedules: WorkSchedule[]
): ScheduleTime => {
  const schedule = workSchedules.find(s => {
    // 優先使用 pivot.date
    if (s.pivot?.date) {
      return s.pivot.date === date;
    }
    return false;
  });

  if (!schedule) {
    return {
      clockInTime: null,
      clockOutTime: null,
    };
  }

  // 優先使用 pivot 中的時間，如果沒有則使用 schedule 身上的時間
  const clockInTime = schedule.pivot?.clock_in_time || schedule.clock_in_time;
  const clockOutTime = schedule.pivot?.clock_out_time || schedule.clock_out_time;

  return {
    clockInTime: clockInTime || null,
    clockOutTime: clockOutTime || null,
  };
};

/**
 * 將時間字串轉換為 datetime-local 格式
 * @param date 日期 (Dayjs 物件)
 * @param timeString 時間字串 (HH:mm:ss 或 HH:mm)
 * @returns datetime-local 格式的字串
 */
export const formatDateTimeForInput = (date: Dayjs, timeString: string): string => {
  if (!timeString) return '';

  // 處理時間格式，確保是 HH:mm
  const timeParts = timeString.split(':');
  const hours = timeParts[0];
  const minutes = timeParts[1] || '00';

  return date.hour(parseInt(hours)).minute(parseInt(minutes)).format('YYYY-MM-DDTHH:mm');
};

/**
 * 獲取預設的請假開始時間（上班時間）
 * @param date 請假日期
 * @param workSchedules 工作班表
 * @returns 格式化的 datetime-local 字串
 */
export const getDefaultLeaveStartTime = (date: Dayjs, workSchedules: WorkSchedule[]): string => {
  const dateStr = date.format('YYYY-MM-DD');
  const { clockInTime } = getScheduleTimeForDate(dateStr, workSchedules);

  if (clockInTime) {
    return formatDateTimeForInput(date, clockInTime);
  }

  // 如果指定日期沒有班表，嘗試使用今天的班表
  const today = dayjs().format('YYYY-MM-DD');
  if (dateStr !== today) {
    const { clockInTime: todayClockIn } = getScheduleTimeForDate(today, workSchedules);
    if (todayClockIn) {
      return formatDateTimeForInput(date, todayClockIn);
    }
  }

  // 如果都沒有班表，預設為上午 9:00
  return date.hour(9).minute(0).format('YYYY-MM-DDTHH:mm');
};

/**
 * 獲取預設的請假結束時間（下班時間）
 * @param date 請假日期
 * @param workSchedules 工作班表
 * @returns 格式化的 datetime-local 字串
 */
export const getDefaultLeaveEndTime = (date: Dayjs, workSchedules: WorkSchedule[]): string => {
  const dateStr = date.format('YYYY-MM-DD');
  const { clockOutTime } = getScheduleTimeForDate(dateStr, workSchedules);

  if (clockOutTime) {
    return formatDateTimeForInput(date, clockOutTime);
  }

  // 如果指定日期沒有班表，嘗試使用今天的班表
  const today = dayjs().format('YYYY-MM-DD');
  if (dateStr !== today) {
    const { clockOutTime: todayClockOut } = getScheduleTimeForDate(today, workSchedules);
    if (todayClockOut) {
      return formatDateTimeForInput(date, todayClockOut);
    }
  }

  // 如果都沒有班表，預設為下午 6:00
  return date.hour(18).minute(0).format('YYYY-MM-DDTHH:mm');
};

/**
 * 檢查指定日期是否有班表
 * @param date 日期字串 (YYYY-MM-DD)
 * @param workSchedules 工作班表陣列
 * @returns 是否有班表
 */
export const hasScheduleForDate = (date: string, workSchedules: WorkSchedule[]): boolean => {
  const { clockInTime, clockOutTime } = getScheduleTimeForDate(date, workSchedules);
  return !!(clockInTime && clockOutTime);
};

/**
 * 獲取今天的班表時間，用作其他日期的預設值
 * @param workSchedules 工作班表陣列
 * @returns 今天的班表時間
 */
export const getTodayScheduleTime = (workSchedules: WorkSchedule[]): ScheduleTime => {
  const today = dayjs().format('YYYY-MM-DD');
  return getScheduleTimeForDate(today, workSchedules);
};

/**
 * 根據優先順序獲取預設時間（指定日期 > 今天 > 固定預設值）
 * @param date 目標日期
 * @param workSchedules 工作班表陣列
 * @param isEndTime 是否為結束時間
 * @returns 格式化的 datetime-local 字串
 */
export const getSmartDefaultTime = (
  date: Dayjs,
  workSchedules: WorkSchedule[],
  isEndTime: boolean = false
): string => {
  const dateStr = date.format('YYYY-MM-DD');

  // 1. 優先使用指定日期的班表
  const targetSchedule = getScheduleTimeForDate(dateStr, workSchedules);
  const targetTime = isEndTime ? targetSchedule.clockOutTime : targetSchedule.clockInTime;

  if (targetTime) {
    return formatDateTimeForInput(date, targetTime);
  }

  // 2. 使用今天的班表作為預設
  const todaySchedule = getTodayScheduleTime(workSchedules);
  const todayTime = isEndTime ? todaySchedule.clockOutTime : todaySchedule.clockInTime;

  if (todayTime) {
    return formatDateTimeForInput(date, todayTime);
  }

  // 3. 使用固定預設值
  const defaultHour = isEndTime ? 18 : 9;
  return date.hour(defaultHour).minute(0).format('YYYY-MM-DDTHH:mm');
};
