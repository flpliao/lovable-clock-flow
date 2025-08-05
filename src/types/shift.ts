import { WorkSchedule } from './workSchedule';

export interface Shift {
  id?: string;
  slug: string;
  code: string;
  name: string;
  day_cut_time: string;
  color: string;
  cycle_days?: number;
  work_schedules?: WorkSchedule[];
}

export interface CreateShiftData {
  code: string;
  name: string;
  day_cut_time: string;
  color: string;
}

export interface UpdateShiftData {
  code?: string;
  name?: string;
  day_cut_time?: string;
  color?: string;
  cycle_days?: number;
}
