
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
  validationRules?: {
    genderRestriction?: 'male' | 'female';
    onceOnly?: boolean;
    relationshipRequired?: boolean;
    ageRestriction?: { maxChildAge: number };
    maxYearsPerChild?: number;
  };
}

// Taiwan Labor Law leave types - 符合勞基法規定
export const LEAVE_TYPES: LeaveType[] = [
  {
    id: "annual",
    name: "特別休假",
    name_en: "annual",
    isPaid: true,
    annualReset: true,
    requiresAttachment: false,
    description: "視年資自動計算剩餘天數（每年3～30日）"
  },
  {
    id: "personal",
    name: "事假（無薪）",
    name_en: "personal",
    isPaid: false,
    annualReset: true,
    maxDaysPerYear: 14,
    requiresAttachment: false,
    description: "每年最多14天，超過部分無薪"
  },
  {
    id: "sick",
    name: "病假（依勞基法規定）",
    name_en: "sick",
    isPaid: true, // 前30天半薪
    annualReset: true,
    maxDaysPerYear: 30,
    requiresAttachment: true,
    description: "每年最多30天，30天內依法給半薪，超過後可視為留職停薪"
  },
  {
    id: "marriage",
    name: "婚假",
    name_en: "marriage",
    isPaid: true,
    annualReset: false,
    maxDaysPerYear: 8,
    requiresAttachment: true,
    description: "僅限一次，8日內，須於結婚後1年內請完",
    validationRules: {
      onceOnly: true
    }
  },
  {
    id: "bereavement",
    name: "喪假",
    name_en: "bereavement",
    isPaid: true,
    annualReset: true,
    requiresAttachment: true,
    description: "根據親屬關係：父母/配偶8日、祖父母/兄弟姊妹6日、其他3日",
    validationRules: {
      relationshipRequired: true
    }
  },
  {
    id: "maternity",
    name: "產假",
    name_en: "maternity",
    isPaid: true,
    annualReset: true,
    maxDaysPerYear: 56, // 8週
    requiresAttachment: true,
    description: "固定8週（56天），女性員工限定",
    validationRules: {
      genderRestriction: 'female'
    }
  },
  {
    id: "paternity",
    name: "陪產假",
    name_en: "paternity",
    isPaid: true,
    annualReset: true,
    maxDaysPerYear: 7,
    requiresAttachment: false,
    description: "固定7天，全薪，男性員工限定，配偶懷孕期間申請",
    validationRules: {
      genderRestriction: 'male'
    }
  },
  {
    id: "parental",
    name: "育嬰留停（無薪）",
    name_en: "parental",
    isPaid: false,
    annualReset: false,
    requiresAttachment: true,
    description: "每名子女最長2年，需於子女滿3歲前結束",
    validationRules: {
      maxYearsPerChild: 2,
      ageRestriction: { maxChildAge: 3 }
    }
  },
  {
    id: "occupational",
    name: "公傷病假",
    name_en: "occupational",
    isPaid: true,
    annualReset: false,
    requiresAttachment: true,
    description: "不限制天數，需檢附職災證明，不併入病假計算"
  },
  {
    id: "other",
    name: "其他（無薪）",
    name_en: "other",
    isPaid: false,
    annualReset: true,
    requiresAttachment: false,
    description: "自訂請假類型，需填寫詳細原因，由主管人工審核"
  }
];

// Helper to get leave type by id
export const getLeaveTypeById = (id: string): LeaveType | undefined => {
  return LEAVE_TYPES.find(type => type.id === id);
};

// Define schema for leave form with enhanced validation
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
  relationship: z.string().optional(), // For bereavement leave
  child_info: z.object({
    name: z.string().optional(),
    birth_date: z.date().optional(),
  }).optional(), // For parental leave
}).refine((data) => data.end_date >= data.start_date, {
  message: "結束日期不能早於開始日期",
  path: ["end_date"],
});

export type LeaveFormValues = z.infer<typeof leaveFormSchema>;

// Enhanced leave type text helper
export const getLeaveTypeText = (type: string): string => {
  const leaveType = getLeaveTypeById(type);
  return leaveType?.name || '其他';
};

// Get relationship options for bereavement leave
export const BEREAVEMENT_RELATIONSHIPS = [
  { value: 'parent', label: '父母', days: 8 },
  { value: 'spouse', label: '配偶', days: 8 },
  { value: 'grandparent', label: '祖父母', days: 6 },
  { value: 'sibling', label: '兄弟姊妹', days: 6 },
  { value: 'child', label: '子女', days: 8 },
  { value: 'other', label: '其他親屬', days: 3 }
];

// Calculate bereavement days based on relationship
export const getBereavementDays = (relationship: string): number => {
  const rel = BEREAVEMENT_RELATIONSHIPS.find(r => r.value === relationship);
  return rel?.days || 3;
};
