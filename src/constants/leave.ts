/**
 * 請假類型代碼常數
 */
export enum LeaveTypeCode {
  ANNUAL = 'ANNUAL', // 特休
  SICK = 'SICK', // 病假
  PERSONAL = 'PERSONAL', // 事假
  DISASTER = 'DISASTER', // 天災假
  MARRIAGE = 'MARRIAGE', // 婚假
  BEREAVEMENT_L1 = 'BEREAVEMENT_L1', // 一等親喪假 (父母、配偶)
  BEREAVEMENT_L2 = 'BEREAVEMENT_L2', // 二等親喪假 (子女祖父母、配偶之父母)
  BEREAVEMENT_L3 = 'BEREAVEMENT_L3', // 三等親喪假 (兄弟姊妹、曾祖父母、配偶之祖父母)
  MATERNITY = 'MATERNITY', // 產假
  PATERNITY = 'PATERNITY', // 陪產假
  MATERNITY_CHECK = 'MATERNITY_CHECK', // 產檢假
  MENSTRUAL = 'MENSTRUAL', // 生理假
  FAMILY_CARE = 'FAMILY_CARE', // 家庭照顧假
  OTHER = 'OTHER', // 其他
}

/**
 * 薪資類型常數
 */
export enum PaidType {
  UNPAID = 'unpaid',
  HALF = 'half',
  PAID = 'paid',
}
