import dayjs from 'dayjs';
import { z } from 'zod';
import { LeaveType } from './leaveType';

// 請假申請狀態
export enum LeaveRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

// 請假申請記錄
export interface LeaveRequest {
  slug: string;
  employee_id?: string; // 可選，創建時後端會自動從認證信息中獲取
  start_date: string;
  end_date: string;
  leave_type_id?: string;
  leave_type_code: string;
  status: LeaveRequestStatus;
  duration_hours: number;
  reason: string;
  rejection_reason?: string;
  leave_type?: LeaveType;
  created_at: string;
  updated_at: string;
}

// 審核狀態
export enum ApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// 審核記錄
export interface ApprovalRecord {
  slug: string;
  leave_request_id: string;
  approver_id: string;
  approver_name: string;
  status: ApprovalStatus;
  level: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

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
    status: z.nativeEnum(LeaveRequestStatus).default(LeaveRequestStatus.PENDING),
    attachment: z.any().optional(),
  })
  .refine(data => data.end_date.isAfter(data.start_date) || data.end_date.isSame(data.start_date), {
    message: '結束日期不能早於開始日期',
    path: ['end_date'],
  });

export type LeaveRequestFormValues = z.infer<typeof leaveRequestFormSchema> & {
  attachment?: File | null;
};
