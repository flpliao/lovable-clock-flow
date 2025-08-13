import { WorkScheduleStatus } from '@/constants/workSchedule';
import { z } from 'zod';

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
