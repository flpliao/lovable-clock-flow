
import { z } from "zod";

// Define the leave type structure
export interface LeaveType {
  id: string;
  name: string;
  name_en: string; // English name for internal use
  isPaid: boolean;
  annualReset: boolean;
  maxDaysPerYear?: number;
  requiresAttachment: boolean;
  description: string;
}

// Taiwan Labor Law leave types
export const LEAVE_TYPES: LeaveType[] = [
  {
    id: "annual",
    name: "特別休假",
    name_en: "annual",
    isPaid: true,
    annualReset: true,
    description: "根據年資分配天數"
  },
  {
    id: "personal",
    name: "事假",
    name_en: "personal",
    isPaid: false,
    annualReset: true,
    maxDaysPerYear: 14,
    requiresAttachment: false,
    description: "每年最多14天"
  },
  {
    id: "sick",
    name: "病假",
    name_en: "sick",
    isPaid: false, // 前30天半薪
    annualReset: true,
    maxDaysPerYear: 30,
    requiresAttachment: true,
    description: "最多30天，前30日半薪"
  },
  {
    id: "marriage",
    name: "婚假",
    name_en: "marriage",
    isPaid: true,
    annualReset: true,
    maxDaysPerYear: 8,
    requiresAttachment: true,
    description: "須於結婚後1年內請完"
  },
  {
    id: "bereavement",
    name: "喪假",
    name_en: "bereavement",
    isPaid: true,
    annualReset: true,
    requiresAttachment: true,
    description: "3～8天，依親等"
  },
  {
    id: "maternity",
    name: "產假",
    name_en: "maternity",
    isPaid: true,
    annualReset: true,
    maxDaysPerYear: 56, // 8週
    requiresAttachment: true,
    description: "8週，須附診斷證明"
  },
  {
    id: "paternity",
    name: "陪產假",
    name_en: "paternity",
    isPaid: true,
    annualReset: true,
    maxDaysPerYear: 7,
    requiresAttachment: false,
    description: "7天，於配偶分娩前後使用"
  },
  {
    id: "parental",
    name: "育嬰留停",
    name_en: "parental",
    isPaid: false,
    annualReset: false,
    requiresAttachment: true,
    description: "最長2年，需符合子女未滿三歲"
  },
  {
    id: "occupational",
    name: "公傷病假",
    name_en: "occupational",
    isPaid: true,
    annualReset: false,
    requiresAttachment: true,
    description: "因公受傷、工殤"
  },
  {
    id: "other",
    name: "其他",
    name_en: "other",
    isPaid: false,
    annualReset: true,
    requiresAttachment: false,
    description: "其他請假"
  }
];

// Helper to get leave type by id
export const getLeaveTypeById = (id: string): LeaveType | undefined => {
  return LEAVE_TYPES.find(type => type.id === id);
};

// Define schema for leave form
export const leaveFormSchema = z.object({
  start_date: z.date({
    required_error: "請選擇請假開始日期",
  }),
  end_date: z.date({
    required_error: "請選擇請假結束日期",
  }).refine(date => date, {
    message: "請選擇請假結束日期",
  }),
  leave_type: z.string({
    required_error: "請選擇請假類型",
  }),
  reason: z.string().min(1, {
    message: "請輸入請假事由",
  }),
  attachment: z.any().optional(),
}).refine((data) => data.end_date >= data.start_date, {
  message: "結束日期不能早於開始日期",
  path: ["end_date"],
});

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;

// Update the leave type texts in utils
export const getLeaveTypeText = (type: string): string => {
  const leaveType = getLeaveTypeById(type);
  return leaveType?.name || '其他';
};
