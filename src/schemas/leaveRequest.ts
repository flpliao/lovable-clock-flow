import { RequestStatus } from '@/constants/requestStatus';
import dayjs from 'dayjs';
import { z } from 'zod';

// 請假申請表單 Schema
export const leaveRequestFormSchema = z
  .object({
    start_date: z.custom<dayjs.Dayjs>(val => val instanceof dayjs, {
      message: '請選擇請假開始日期',
    }),
    end_date: z.custom<dayjs.Dayjs>(val => val instanceof dayjs, {
      message: '請選擇請假結束日期',
    }),
    leave_type_code: z.string().min(1, {
      message: '請選擇請假類型',
    }),
    reason: z.string().min(1, {
      message: '請輸入請假事由',
    }),
    duration_hours: z.number().min(0, {
      message: '請假時數不能為負數',
    }),
    status: z.nativeEnum(RequestStatus).default(RequestStatus.PENDING),
    attachment: z.any().optional(),
  })
  .refine(data => data.end_date.isAfter(data.start_date) || data.end_date.isSame(data.start_date), {
    message: '結束日期不能早於開始日期',
    path: ['end_date'],
  });

export type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema> & {
  attachment?: File | null;
};
