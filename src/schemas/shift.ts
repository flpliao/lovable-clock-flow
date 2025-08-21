import { z } from 'zod';

// 班次表單驗證 schema
export const shiftFormSchema = z.object({
  code: z.string().min(1, '班次代碼為必填項目'),
  name: z.string().min(1, '班次名稱為必填項目'),
  day_cut_time: z.string().min(1, '日切時間為必填項目'),
  color: z.string().min(1, '顏色為必填項目'),
});

export type ShiftFormData = z.infer<typeof shiftFormSchema>;
