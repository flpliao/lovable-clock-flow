import { WorkSchedule } from '@/types/workSchedule';

// 轉換 WorkSchedule[] 為按日期索引的格式
export const convertWorkSchedulesToDateMap = (
  workSchedules: WorkSchedule[]
): Record<
  string,
  {
    id: number;
    shift: {
      code: string;
      name: string;
      color: string;
    } | null;
    clock_in_time: string;
    clock_out_time: string;
  }
> => {
  const workSchedulesByDate: Record<
    string,
    {
      id: number;
      shift: {
        code: string;
        name: string;
        color: string;
      } | null;
      clock_in_time: string;
      clock_out_time: string;
    }
  > = {};

  workSchedules.forEach(workSchedule => {
    const date = workSchedule.pivot?.date;
    if (!date) return;

    workSchedulesByDate[date] = {
      id: parseInt(workSchedule.slug) || 0,
      shift: workSchedule.shift
        ? {
            code: workSchedule.shift.code || '',
            name: workSchedule.shift.name || '',
            color: workSchedule.shift.color || '#3B82F6',
          }
        : null,
      clock_in_time: workSchedule.pivot?.clock_in_time || workSchedule.clock_in_time,
      clock_out_time: workSchedule.pivot?.clock_out_time || workSchedule.clock_out_time,
    };
  });

  return workSchedulesByDate;
};
