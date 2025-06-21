
import { differenceInMonths, differenceInYears } from 'date-fns';

// 台灣勞基法第38條 - 年資對應特休天數對照表
export const ANNUAL_LEAVE_SCHEDULE = [
  { minMonths: 0, maxMonths: 5, days: 0, description: '未滿6個月' },
  { minMonths: 6, maxMonths: 11, days: 3, description: '滿6個月未滿1年' },
  { minMonths: 12, maxMonths: 23, days: 7, description: '滿1年未滿2年' },
  { minMonths: 24, maxMonths: 35, days: 10, description: '滿2年未滿3年' },
  { minMonths: 36, maxMonths: 59, days: 14, description: '滿3年未滿5年' },
  { minMonths: 60, maxMonths: 119, days: 15, description: '滿5年未滿10年' },
];

/**
 * 根據入職日期計算年資（以月為單位）
 */
export function calculateMonthsOfService(hireDate: Date): number {
  return differenceInMonths(new Date(), hireDate);
}

/**
 * 根據入職日期計算年資（以年為單位，含小數）
 */
export function calculateYearsOfService(hireDate: Date): number {
  const months = calculateMonthsOfService(hireDate);
  return Math.round((months / 12) * 10) / 10; // 保留一位小數
}

/**
 * 根據台灣勞基法第38條計算特別休假天數
 */
export function calculateAnnualLeaveDays(hireDate: Date): number {
  const months = calculateMonthsOfService(hireDate);
  const years = differenceInYears(new Date(), hireDate);
  
  // 未滿6個月
  if (months < 6) return 0;
  
  // 滿6個月未滿1年
  if (months < 12) return 3;
  
  // 滿1年未滿2年
  if (years < 2) return 7;
  
  // 滿2年未滿3年
  if (years < 3) return 10;
  
  // 滿3年未滿5年
  if (years < 5) return 14;
  
  // 滿5年未滿10年
  if (years < 10) return 15;
  
  // 滿10年以上，每滿一年增加一天，最高30天
  const additionalDays = Math.min(15, years - 10 + 1);
  return Math.min(30, 15 + additionalDays);
}

/**
 * 格式化年資顯示文字
 */
export function formatYearsOfService(hireDate: Date): string {
  const years = Math.floor(calculateYearsOfService(hireDate));
  const months = calculateMonthsOfService(hireDate) % 12;
  
  if (years === 0) {
    return `${months}個月`;
  } else if (months === 0) {
    return `${years}年`;
  } else {
    return `${years}年${months}個月`;
  }
}

/**
 * 取得年資對應的特休說明
 */
export function getAnnualLeaveDescription(hireDate: Date): string {
  const months = calculateMonthsOfService(hireDate);
  const years = differenceInYears(new Date(), hireDate);
  
  for (const schedule of ANNUAL_LEAVE_SCHEDULE) {
    if (months >= schedule.minMonths && months <= schedule.maxMonths) {
      return schedule.description;
    }
  }
  
  // 滿10年以上的情況
  if (years >= 10) {
    return `滿${years}年`;
  }
  
  return '計算中';
}
