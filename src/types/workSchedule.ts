import { WorkScheduleStatus } from '@/constants/workSchedule';
import { Shift } from '@/types/shift';
import { z } from 'zod';

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
export const createWorkScheduleSchema = z
  .object({
    status: z.enum([WorkScheduleStatus.WORK, WorkScheduleStatus.OFF]),
    clock_in_time: z.string().optional(),
    clock_out_time: z.string().optional(),
    ot_start_after_hours: z.coerce.number().optional(),
    ot_start_after_minutes: z.coerce.number().optional(),
    break1_start: z.string().optional(),
    break1_end: z.string().optional(),
    break2_start: z.string().optional(),
    break2_end: z.string().optional(),
    break3_start: z.string().optional(),
    break3_end: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === WorkScheduleStatus.WORK) {
      if (!data.clock_in_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '請填寫上班時間',
          path: ['clock_in_time'],
        });
      }
      if (!data.clock_out_time) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '請填寫下班時間',
          path: ['clock_out_time'],
        });
      }
    }
  });

export type CreateWorkScheduleFormData = z.infer<typeof createWorkScheduleSchema>;
