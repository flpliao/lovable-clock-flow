import { LeaveTypeCode } from '@/constants/leave';

// 需要額外日期欄位的請假類型配置
export interface LeaveTypeExtraField {
  code: LeaveTypeCode;
  fieldLabel: string;
  fieldDescription: string;
  required: boolean;
}

// 定義需要額外日期欄位的請假類型
export const LEAVE_TYPES_WITH_REFERENCE_DATE: LeaveTypeExtraField[] = [
  {
    code: LeaveTypeCode.MARRIAGE,
    fieldLabel: '登記日',
    fieldDescription: '請選擇結婚登記日期',
    required: true,
  },
  {
    code: LeaveTypeCode.BEREAVEMENT_L1,
    fieldLabel: '死亡日',
    fieldDescription: '請選擇親屬死亡日期',
    required: true,
  },
  {
    code: LeaveTypeCode.BEREAVEMENT_L2,
    fieldLabel: '死亡日',
    fieldDescription: '請選擇親屬死亡日期',
    required: true,
  },
  {
    code: LeaveTypeCode.BEREAVEMENT_L3,
    fieldLabel: '死亡日',
    fieldDescription: '請選擇親屬死亡日期',
    required: true,
  },
  {
    code: LeaveTypeCode.MATERNITY,
    fieldLabel: '預產期',
    fieldDescription: '請選擇預產期日期',
    required: true,
  },
  {
    code: LeaveTypeCode.PATERNITY,
    fieldLabel: '預產期/出生日',
    fieldDescription: '請選擇預產期或出生日期',
    required: false,
  },
];

/**
 * 檢查指定的請假類型是否需要額外的日期欄位
 * @param leaveTypeCode 請假類型代碼
 * @returns 如果需要額外欄位則返回配置，否則返回 null
 */
export const getLeaveTypeExtraField = (leaveTypeCode: string): LeaveTypeExtraField | null => {
  return LEAVE_TYPES_WITH_REFERENCE_DATE.find(config => config.code === leaveTypeCode) || null;
};

/**
 * 檢查指定的請假類型是否需要額外的日期欄位
 * @param leaveTypeCode 請假類型代碼
 * @returns 布林值
 */
export const requiresReferenceDate = (leaveTypeCode: string): boolean => {
  return LEAVE_TYPES_WITH_REFERENCE_DATE.some(config => config.code === leaveTypeCode);
};

/**
 * 檢查指定的請假類型的額外欄位是否為必填
 * @param leaveTypeCode 請假類型代碼
 * @returns 布林值
 */
export const isReferenceDateRequired = (leaveTypeCode: string): boolean => {
  const config = getLeaveTypeExtraField(leaveTypeCode);
  return config ? config.required : false;
};
