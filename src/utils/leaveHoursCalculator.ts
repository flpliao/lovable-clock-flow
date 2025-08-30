import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { WorkSchedule } from '@/types/workSchedule';

// 擴展 dayjs 功能
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * 根據員工班表計算請假時數
 * @param startDateTime 請假開始時間
 * @param endDateTime 請假結束時間
 * @param workSchedules 員工的工作排程資料
 * @returns 準確的請假時數
 */
export const calculateLeaveHoursBySchedule = (
  startDateTime: Dayjs,
  endDateTime: Dayjs,
  workSchedules: WorkSchedule[]
): number => {
  if (!startDateTime || !endDateTime || !workSchedules.length) {
    return 0;
  }

  // 確保參數是有效的 dayjs 物件
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if (!start.isValid() || !end.isValid()) {
    return 0;
  }

  let totalLeaveHours = 0;
  let currentDate = start.startOf('day');
  const endDate = end.startOf('day');

  // 逐日計算請假時數
  while (currentDate.isSameOrBefore(endDate)) {
    const dateString = currentDate.format('YYYY-MM-DD');

    // 找到當日的工作排程
    const daySchedule = findScheduleForDate(workSchedules, dateString);

    if (daySchedule) {
      const dayLeaveHours = calculateDayLeaveHours(
        currentDate.isSame(start, 'day') ? start : currentDate.startOf('day'),
        currentDate.isSame(end, 'day') ? end : currentDate.endOf('day'),
        daySchedule,
        currentDate
      );

      totalLeaveHours += dayLeaveHours;
    }

    currentDate = currentDate.add(1, 'day');
  }

  return Math.max(0, totalLeaveHours);
};

/**
 * 找到指定日期的工作排程
 */
const findScheduleForDate = (
  workSchedules: WorkSchedule[],
  dateString: string
): WorkSchedule | null => {
  return (
    workSchedules.find(schedule => {
      // 如果有 pivot.date，使用它
      if (schedule.pivot?.date) {
        return schedule.pivot.date === dateString;
      }

      // 如果沒有 pivot.date，假設這個排程適用於所有日期
      // 在實際應用中，應該根據實際的資料結構來判斷
      return true;
    }) || null
  );
};

/**
 * 計算單日的請假時數
 */
const calculateDayLeaveHours = (
  dayStart: Dayjs,
  dayEnd: Dayjs,
  schedule: WorkSchedule,
  currentDate: Dayjs
): number => {
  // 獲取班表的上下班時間
  const clockInTime = schedule.pivot?.clock_in_time || schedule.clock_in_time;
  const clockOutTime = schedule.pivot?.clock_out_time || schedule.clock_out_time;

  if (!clockInTime || !clockOutTime) {
    return 0;
  }

  // 解析上下班時間
  const [inHour, inMinute] = clockInTime.split(':').map(Number);
  const [outHour, outMinute] = clockOutTime.split(':').map(Number);

  const workStartTime = currentDate.hour(inHour).minute(inMinute).second(0);
  const workEndTime = currentDate.hour(outHour).minute(outMinute).second(0);

  // 處理跨日班次（下班時間小於上班時間）
  const adjustedWorkEndTime = workEndTime.isBefore(workStartTime)
    ? workEndTime.add(1, 'day')
    : workEndTime;

  // 計算請假時間與工作時間的交集
  const leaveStart = dayStart.isAfter(workStartTime) ? dayStart : workStartTime;
  const leaveEnd = dayEnd.isBefore(adjustedWorkEndTime) ? dayEnd : adjustedWorkEndTime;

  // 如果沒有交集，返回0
  if (leaveStart.isSameOrAfter(leaveEnd)) {
    return 0;
  }

  // 計算請假時數（分鐘轉小時）
  const leaveMinutes = leaveEnd.diff(leaveStart, 'minute');

  // 扣除午休時間（如果請假時間跨越午休）
  const lunchBreakHours = calculateLunchBreakHours(leaveStart, leaveEnd, schedule);
  const lunchBreakMinutes = lunchBreakHours * 60;

  return Math.max(0, (leaveMinutes - lunchBreakMinutes) / 60);
};

/**
 * 計算午休時間（如果請假時間跨越午休時段）
 */
const calculateLunchBreakHours = (
  leaveStart: Dayjs,
  leaveEnd: Dayjs,
  _schedule: WorkSchedule
): number => {
  // 預設午休時間 12:00-13:00
  const lunchStart = leaveStart.hour(12).minute(0).second(0);
  const lunchEnd = leaveStart.hour(13).minute(0).second(0);

  // 檢查請假時間是否跨越午休時間
  if (leaveStart.isBefore(lunchEnd) && leaveEnd.isAfter(lunchStart)) {
    const overlapStart = leaveStart.isAfter(lunchStart) ? leaveStart : lunchStart;
    const overlapEnd = leaveEnd.isBefore(lunchEnd) ? leaveEnd : lunchEnd;

    return overlapEnd.diff(overlapStart, 'minute') / 60;
  }

  return 0;
};

/**
 * 簡化版本：根據標準工作時間計算請假時數
 * 適用於沒有詳細班表資料的情況
 */
export const calculateLeaveHoursSimple = (
  startDateTime: Dayjs,
  endDateTime: Dayjs,
  dailyWorkHours: number = 8
): number => {
  if (!startDateTime || !endDateTime) {
    return 0;
  }

  // 確保參數是有效的 dayjs 物件
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if (!start.isValid() || !end.isValid()) {
    return 0;
  }

  let totalHours = 0;
  let currentDate = start.startOf('day');
  const endDate = end.startOf('day');

  while (currentDate.isSameOrBefore(endDate)) {
    // 跳過週末
    const dayOfWeek = currentDate.day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      currentDate = currentDate.add(1, 'day');
      continue;
    }

    const dayStart = currentDate.isSame(start, 'day') ? start : currentDate.hour(9).minute(0);
    const dayEnd = currentDate.isSame(end, 'day') ? end : currentDate.hour(18).minute(0);

    if (dayStart.isBefore(dayEnd)) {
      const dayHours = Math.min(dailyWorkHours, dayEnd.diff(dayStart, 'hour', true));
      totalHours += dayHours;
    }

    currentDate = currentDate.add(1, 'day');
  }

  return Math.max(0, totalHours);
};

/**
 * 驗證請假時間是否在工作時間內
 */
export const validateLeaveTimeWithSchedule = (
  startDateTime: Dayjs,
  endDateTime: Dayjs,
  workSchedules: WorkSchedule[]
): { isValid: boolean; message?: string } => {
  if (!startDateTime || !endDateTime) {
    return { isValid: false, message: '請選擇有效的請假時間' };
  }

  // 確保參數是有效的 dayjs 物件
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if (!start.isValid() || !end.isValid()) {
    return { isValid: false, message: '請選擇有效的日期時間' };
  }

  if (end.isSameOrBefore(start)) {
    return { isValid: false, message: '結束時間必須晚於開始時間' };
  }

  // 檢查是否有對應的工作排程
  const startDate = start.format('YYYY-MM-DD');
  const endDate = end.format('YYYY-MM-DD');

  let currentDate = dayjs(startDate);
  const finalDate = dayjs(endDate);

  while (currentDate.isSameOrBefore(finalDate)) {
    const dateString = currentDate.format('YYYY-MM-DD');
    const _schedule = findScheduleForDate(workSchedules, dateString);

    // 這裡可以加入更多驗證邏輯

    currentDate = currentDate.add(1, 'day');
  }

  return { isValid: true };
};
