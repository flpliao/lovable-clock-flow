import { z } from 'zod';
import { Shift } from './shift';

export enum WorkScheduleStatus {
  WORK = 'work',
  OFF = 'off',
}

export interface WorkSchedulePivot {
  status: string;
  date: string;
}

export interface WorkSchedule {
  slug: string;
  shift_id: string;
  shift?: Shift;
  pivot?: WorkSchedulePivot;
  status: WorkScheduleStatus;
  clock_in_time: string;
  clock_out_time: string;
  ot_start_after_hours: number;
  ot_start_after_minutes: number;
  break1_start?: string;
  break1_end?: string;
  break2_start?: string;
  break2_end?: string;
  break3_start?: string;
  break3_end?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWorkScheduleData {
  shift_slug?: string;
  slug?: string;
  status: WorkScheduleStatus;
  clock_in_time: string;
  clock_out_time: string;
  ot_start_after_hours: number;
  ot_start_after_minutes: number;
  break1_start?: string;
  break1_end?: string;
  break2_start?: string;
  break2_end?: string;
  break3_start?: string;
  break3_end?: string;
}

export interface UpdateWorkScheduleData {
  slug?: string;
  status?: WorkScheduleStatus;
  clock_in_time?: string;
  clock_out_time?: string;
  ot_start_after_hours?: number;
  ot_start_after_minutes?: number;
  break1_start?: string;
  break1_end?: string;
  break2_start?: string;
  break2_end?: string;
  break3_start?: string;
  break3_end?: string;
}

// 表單驗證 Schema
export const createWorkScheduleSchema = z.object({
  status: z.enum([WorkScheduleStatus.WORK, WorkScheduleStatus.OFF]),
  clock_in_time: z.string().min(1, '上班時間為必填'),
  clock_out_time: z.string().min(1, '下班時間為必填'),
  ot_start_after_hours: z.coerce
    .number()
    .min(0, '加班開始小時不能小於0')
    .max(23, '加班開始小時不能大於23'),
  ot_start_after_minutes: z.coerce
    .number()
    .min(0, '加班開始分鐘不能小於0')
    .max(59, '加班開始分鐘不能大於59'),
  break1_start: z.string().optional(),
  break1_end: z.string().optional(),
  break2_start: z.string().optional(),
  break2_end: z.string().optional(),
  break3_start: z.string().optional(),
  break3_end: z.string().optional(),
});

export type CreateWorkScheduleFormData = z.infer<typeof createWorkScheduleSchema>;
