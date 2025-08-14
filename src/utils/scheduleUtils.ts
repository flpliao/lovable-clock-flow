import { WorkSchedule } from '@/types/workSchedule';
import { formatTimeString } from './dateTimeUtils';

/**
 * 獲取工作時間範圍
 * @param workSchedule 員工工作班表
 * @returns 格式化的時間範圍字串，如果沒有時間則返回 '-'
 */
export const getWorkTimeRange = (workSchedule: WorkSchedule | undefined): string => {
  if (!workSchedule) return '-';

  // 優先使用 pivot 中的時間，如果沒有則使用 workSchedule 身上的時間
  const clockInTime = workSchedule.pivot?.clock_in_time || workSchedule.clock_in_time;
  const clockOutTime = workSchedule.pivot?.clock_out_time || workSchedule.clock_out_time;

  if (!clockInTime || !clockOutTime) return '-';

  const startTime = formatTimeString(clockInTime);
  const endTime = formatTimeString(clockOutTime);

  return `${startTime} ~ ${endTime}`;
};
