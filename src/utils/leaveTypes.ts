import { LeaveType } from '@/types/leaveType';
import { LeaveTypeCode, PaidType } from '@/constants/leave';

// Extended leave type structure for mock data with validation rules
export interface ExtendedLeaveType extends LeaveType {
  validationRules?: {
    genderRestriction?: 'male' | 'female';
    onceOnly?: boolean;
    relationshipRequired?: boolean;
    ageRestriction?: { maxChildAge: number };
    maxYearsPerChild?: number;
    monthlyLimit?: number;
    combinedWith?: string[]; // For combined limits with other leave types
  };
}

// Taiwan Labor Law leave types - 符合勞基法規定
export const LEAVE_TYPES: ExtendedLeaveType[] = [
  {
    slug: 'annual',
    name: '特別休假',
    code: LeaveTypeCode.ANNUAL,
    paid_type: PaidType.PAID,
    annual_reset: true,
    required_attachment: false,
    description: '視年資自動計算剩餘天數（每年3～30日）',
    is_active: true,
  },
  {
    slug: 'personal',
    name: '事假',
    code: LeaveTypeCode.PERSONAL,
    paid_type: PaidType.UNPAID,
    annual_reset: true,
    max_per_year: 14,
    required_attachment: false,
    description: '每年最多14天，超過部分無薪',
    is_active: true,
  },
  {
    slug: 'sick',
    name: '病假',
    code: LeaveTypeCode.SICK,
    paid_type: PaidType.HALF,
    annual_reset: true,
    max_per_year: 30,
    required_attachment: true,
    description: '每年最多30天，30天內依法給半薪，超過後可視為留職停薪',
    is_active: true,
  },
  {
    slug: 'marriage',
    name: '婚假',
    code: LeaveTypeCode.MARRIAGE,
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 8,
    required_attachment: true,
    description: '僅限一次，8日內，須於結婚後1年內請完',
    is_active: true,
    validationRules: {
      onceOnly: true,
    },
  },
  {
    slug: 'bereavement-l1',
    name: '一等親喪假',
    code: LeaveTypeCode.BEREAVEMENT_L1,
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 8,
    required_attachment: true,
    description: '父母、配偶過世時享有之有薪喪假，8天',
    is_active: true,
    validationRules: {
      relationshipRequired: true,
    },
  },
  {
    slug: 'bereavement-l2',
    name: '二等親喪假',
    code: LeaveTypeCode.BEREAVEMENT_L2,
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 6,
    required_attachment: true,
    description: '祖父母、兄弟姊妹、岳父母等二等親過世時享有之有薪喪假，6天',
    is_active: true,
    validationRules: {
      relationshipRequired: true,
    },
  },
  {
    slug: 'bereavement-l3',
    name: '三等親喪假',
    code: LeaveTypeCode.BEREAVEMENT_L3,
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 3,
    required_attachment: true,
    description: '伯叔父母、姑丈嬸母等三等親過世時享有之有薪喪假，3天',
    is_active: true,
    validationRules: {
      relationshipRequired: true,
    },
  },
  {
    slug: 'maternity',
    name: '產假',
    code: LeaveTypeCode.MATERNITY,
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 56,
    required_attachment: true,
    description: '女性員工生產時享有之有薪產假，56天（8週）',
    is_active: true,
    validationRules: {
      genderRestriction: 'female',
    },
  },
  {
    slug: 'paternity',
    name: '陪產假',
    code: LeaveTypeCode.PATERNITY,
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 5,
    required_attachment: true,
    description: '男性員工配偶生產時享有之有薪陪產假，5天',
    is_active: true,
    validationRules: {
      genderRestriction: 'male',
    },
  },
  {
    slug: 'special',
    name: '特殊假',
    code: LeaveTypeCode.SPECIAL,
    paid_type: PaidType.UNPAID,
    annual_reset: true,
    required_attachment: false,
    description: '特殊情況請假，需主管核准',
    is_active: true,
  },
  {
    slug: 'other',
    name: '其他',
    code: LeaveTypeCode.OTHER,
    paid_type: PaidType.UNPAID,
    annual_reset: true,
    required_attachment: false,
    description: '自訂請假類型，需填寫詳細原因，由主管人工審核',
    is_active: true,
  },
];

// Helper to get leave type by slug
export const getLeaveTypeBySlug = (slug: string): ExtendedLeaveType | undefined => {
  return LEAVE_TYPES.find(type => type.slug === slug);
};

// Backward compatibility - helper to get leave type by id (now slug)
export const getLeaveTypeById = (id: string): ExtendedLeaveType | undefined => {
  return getLeaveTypeBySlug(id);
};

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
  { value: 'other', label: '其他親屬', days: 3 },
];

// Calculate bereavement days based on relationship
export const getBereavementDays = (relationship: string): number => {
  const rel = BEREAVEMENT_RELATIONSHIPS.find(r => r.value === relationship);
  return rel?.days || 3;
};
