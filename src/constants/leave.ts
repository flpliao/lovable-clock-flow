/**
 * 請假類型代碼常數
 */
export enum LeaveTypeCode {
  OTHER = 'OTHER',
  ANNUAL = 'ANNUAL',
  SICK = 'SICK',
  PERSONAL = 'PERSONAL',
  MARRIAGE = 'MARRIAGE',
  BEREAVEMENT_L1 = 'BEREAVEMENT_L1',
  BEREAVEMENT_L2 = 'BEREAVEMENT_L2',
  BEREAVEMENT_L3 = 'BEREAVEMENT_L3',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  SPECIAL = 'SPECIAL',
}

/**
 * 薪資類型常數
 */
export enum PaidType {
  UNPAID = 'unpaid',
  HALF = 'half',
  PAID = 'paid',
}

/**
 * 假別類型預設配置
 * 根據 LeaveCalculationService.php 的業務邏輯設定
 */
export const LEAVE_TYPE_DEFAULTS = {
  [LeaveTypeCode.ANNUAL]: {
    name: '特休',
    paid_type: PaidType.PAID,
    annual_reset: true,
    max_per_year: 14,
    required_attachment: false,
    description:
      '特別休假依年資計算天數，按到職日計算年度週期。系統會根據員工到職日期自動計算特休年度範圍，而非使用日曆年度。剩餘時數計算會考慮員工的實際年資與到職週年日。',
  },
  [LeaveTypeCode.SICK]: {
    name: '病假',
    paid_type: PaidType.HALF,
    annual_reset: true,
    max_per_year: 30,
    required_attachment: true,
    description:
      '因疾病需要治療或休養而請假，半薪給付。按日曆年度計算使用額度，每年重置。需提供醫療機構開立之診斷證明書或就醫證明。',
  },
  [LeaveTypeCode.PERSONAL]: {
    name: '事假',
    paid_type: PaidType.UNPAID,
    annual_reset: true,
    max_per_year: 14,
    required_attachment: false,
    description:
      '因個人事務需要處理而請假，無薪假別。按日曆年度計算使用額度，每年重置。通常不需要提供證明文件，但需事前申請並獲得主管核准。',
  },
  [LeaveTypeCode.MARRIAGE]: {
    name: '婚假',
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 8,
    required_attachment: true,
    description:
      '結婚時享有之有薪假期，8天。系統會根據結婚登記日期計算有效使用期間（登記日前後各3個月內）。不同一結婚登記日期的婚假統計會分開計算，需提供結婚證書或戶政事務所證明文件。',
  },
  [LeaveTypeCode.BEREAVEMENT_L1]: {
    name: '一等親喪假',
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 8,
    required_attachment: true,
    description:
      '父母、配偶過世時享有之有薪喪假，8天。系統會根據死亡日期計算有效使用期間（死亡日起3個月內）。不同一死亡日期的喪假統計會分開計算，需提供死亡證明書或相關證明文件。',
  },
  [LeaveTypeCode.BEREAVEMENT_L2]: {
    name: '二等親喪假',
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 6,
    required_attachment: true,
    description:
      '祖父母、兄弟姊妹、岳父母等二等親過世時享有之有薪喪假，6天。系統會根據死亡日期計算有效使用期間（死亡日起3個月內）。不同一死亡日期的喪假統計會分開計算，需提供死亡證明書或相關證明文件。',
  },
  [LeaveTypeCode.BEREAVEMENT_L3]: {
    name: '三等親喪假',
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 3,
    required_attachment: true,
    description:
      '伯叔父母、姑丈嬸母等三等親過世時享有之有薪喪假，3天。系統會根據死亡日期計算有效使用期間（死亡日起3個月內）。不同一死亡日期的喪假統計會分開計算，需提供死亡證明書或相關證明文件。',
  },
  [LeaveTypeCode.MATERNITY]: {
    name: '產假',
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 56,
    required_attachment: true,
    description:
      '女性員工生產時享有之有薪產假，56天（8週）。系統會根據生產日期或預產期計算有效使用期間（事件日起3個月內）。不同一生產事件的產假統計會分開計算，需提供醫療機構開立之診斷證明書或出生證明。',
  },
  [LeaveTypeCode.PATERNITY]: {
    name: '陪產假',
    paid_type: PaidType.PAID,
    annual_reset: false,
    max_per_year: 5,
    required_attachment: true,
    description:
      '男性員工配偶生產時享有之有薪陪產假，5天。系統會根據配偶生產日期計算有效使用期間（生產日起1個月內）。不同一生產事件的陪產假統計會分開計算，需提供配偶之出生證明或醫療證明文件。',
  },
  [LeaveTypeCode.OTHER]: {
    name: '',
    paid_type: PaidType.UNPAID,
    annual_reset: true,
    max_per_year: undefined,
    required_attachment: false,
    description: '',
  },
} as const;
