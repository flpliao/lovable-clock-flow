import { WorkSchedule } from '@/types/workSchedule';
import { formatTimeString } from './dateTimeUtils';

/**
 * 獲取工作時間範圍
 * @param workSchedule 員工工作班表
 * @returns 格式化的時間範圍字串，如果沒有時間則返回 '-'
 */
export const getWorkTimeRange = (workSchedule: WorkSchedule | undefined): string => {
  if (!workSchedule?.clock_in_time || !workSchedule?.clock_out_time) return '-';

  const startTime = formatTimeString(workSchedule.clock_in_time);
  const endTime = formatTimeString(workSchedule.clock_out_time);

  return `${startTime} ~ ${endTime}`;
};
