import { LeaveTypeCode, PaidType } from '@/constants/leave';
import * as z from 'zod';

/**
 * 假別表單驗證 Schema
 */
export const leaveTypeFormSchema = z.object({
  code: z.nativeEnum(LeaveTypeCode, {
    errorMap: () => ({ message: '請選擇有效的假別類型' }),
  }),
  name: z.string().min(1, '名稱不能為空').max(50, '名稱最多50個字元'),
  paid_type: z.nativeEnum(PaidType, {
    errorMap: () => ({ message: '請選擇有效的薪資類型' }),
  }),
  annual_reset: z.boolean().default(false),
  max_per_year: z.coerce.number().nullable().optional(),
  requires_attachment: z.boolean().default(false),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
});

/**
 * 假別表單資料類型
 */
export type LeaveTypeFormData = z.infer<typeof leaveTypeFormSchema>;

/**
 * 假別表單預設值
 */
export const leaveTypeFormDefaultValues: LeaveTypeFormData = {
  code: LeaveTypeCode.OTHER,
  name: '',
  paid_type: PaidType.UNPAID,
  annual_reset: true,
  max_per_year: undefined,
  requires_attachment: false,
  is_active: true,
  description: '',
};
