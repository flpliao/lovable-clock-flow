import { EmployeeWorkSchedule } from '@/types/employeeWorkSchedule';
import { formatTimeString } from './dateTimeUtils';

/**
 * 獲取工作時間範圍
 * @param workSchedule 員工工作班表
 * @returns 格式化的時間範圍字串，如果沒有時間則返回 '-'
 */
export const getWorkTimeRange = (workSchedule: EmployeeWorkSchedule | undefined): string => {
  if (!workSchedule?.work_schedule) return '-';

  const { clock_in_time, clock_out_time } = workSchedule.work_schedule;
  if (!clock_in_time || !clock_out_time) return '-';

  const startTime = formatTimeString(clock_in_time);
  const endTime = formatTimeString(clock_out_time);

  return `${startTime}-${endTime}`;
};
