
import { differenceInMonths, differenceInYears, format } from 'date-fns';

/**
 * 根據入職日期計算年資（月數）
 */
export function calculateYearsOfService(hireDate: Date): number {
  const now = new Date();
  const months = differenceInMonths(now, hireDate);
  return months / 12;
}

/**
 * 根據台灣勞基法計算特休天數
 */
export function calculateAnnualLeaveDays(hireDate: Date): number {
  const now = new Date();
  const months = differenceInMonths(now, hireDate);
  const years = differenceInYears(now, hireDate);
  
  console.log('🧮 特休天數計算:', {
    hireDate: hireDate.toISOString().split('T')[0],
    currentDate: now.toISOString().split('T')[0],
    months,
    years
  });
  
  // 根據勞基法第38條規定
  if (months < 6) {
    return 0; // 未滿6個月無特休
  } else if (months >= 6 && months < 12) {
    return 3; // 滿6個月，3天
  } else if (years >= 1 && years < 2) {
    return 7; // 滿1年，7天
  } else if (years >= 2 && years < 3) {
    return 10; // 滿2年，10天
  } else if (years >= 3 && years < 5) {
    return 14; // 滿3年，14天
  } else if (years >= 5 && years < 10) {
    return 15; // 滿5年，15天
  } else if (years >= 10) {
    // 滿10年後，每滿1年加1天，最高30天
    const additionalYears = years - 10;
    const calculatedDays = Math.min(30, 15 + additionalYears);
    
    console.log('🎯 滿10年以上特休計算:', {
      years,
      additionalYears,
      baseDays: 15,
      calculatedDays
    });
    
    return calculatedDays;
  }
  
  return 0;
}

/**
 * 格式化年資顯示
 */
export function formatYearsOfService(hireDate: Date): string {
  const now = new Date();
  const years = differenceInYears(now, hireDate);
  const months = differenceInMonths(now, hireDate) % 12;
  
  if (years === 0) {
    return `${months}個月`;
  } else if (months === 0) {
    return `${years}年`;
  } else {
    return `${years}年${months}個月`;
  }
}

/**
 * 計算工作日數（排除週末）
 */
export function calculateWorkDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 排除週日(0)和週六(6)
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * 計算請假時數
 */
export function calculateLeaveHours(startDate: Date, endDate: Date): number {
  const workDays = calculateWorkDays(startDate, endDate);
  return workDays * 8; // 每工作日8小時
}
