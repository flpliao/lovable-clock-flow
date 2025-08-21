import * as z from 'zod';

// 編輯排班表單驗證 schema
export const editScheduleFormSchema = z.object({
  clock_in_time: z.string().min(1, '請選擇上班時間'),
  clock_out_time: z.string().min(1, '請選擇下班時間'),
  comment: z.string().optional(),
});

// 推斷表單資料類型
export type EditScheduleFormValues = z.infer<typeof editScheduleFormSchema>;
