import { RequestType } from '@/constants/checkInTypes';
import { z } from 'zod';

// 忘記打卡表單驗證 schema
export const missedCheckInSchema = z
  .object({
    request_date: z.string().min(1, '請選擇申請日期'),
    request_type: z.nativeEnum(RequestType),
    checked_at: z.string().optional(),
    reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.request_type === RequestType.CHECK_IN && !data.checked_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '請填寫上班時間',
        path: ['checked_at'],
      });
    }

    if (data.request_type === RequestType.CHECK_OUT && !data.checked_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '請填寫下班時間',
        path: ['checked_at'],
      });
    }
  });

export type MissedCheckInFormData = z.infer<typeof missedCheckInSchema>;
