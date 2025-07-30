import dayjs from 'dayjs';

/**
 * 計算年資（基於到職日期）
 * @param startDate 到職日期字串
 * @returns 年資字串，例如 "2年3個月" 或 "未設定"
 */
export function calculateYearsOfService(startDate: string | null | undefined): string {
  if (!startDate) return '未設定';

  const start = dayjs(startDate);
  const currentDate = dayjs();
  const years = currentDate.diff(start, 'year');
  const months = currentDate.diff(start, 'month') % 12;

  if (years === 0) {
    return `${months}個月`;
  } else if (months === 0) {
    return `${years}年`;
  } else {
    return `${years}年${months}個月`;
  }
}

/**
 * 計算特休時數
 * @param startDate 到職日期字串
 * @returns 特休時數物件，包含總時數、已用時數、剩餘時數
 */
export function calculateAnnualLeaveHours(startDate: string | null | undefined): {
  total: number;
  used: number;
  remaining: number;
} {
  if (!startDate) return { total: 0, used: 0, remaining: 0 };

  const start = dayjs(startDate);
  const currentDate = dayjs();
  const diffDays = currentDate.diff(start, 'day');
  const years = Math.floor(diffDays / 365);

  let totalDays = 0;
  if (years >= 1) {
    if (years < 2) totalDays = 7;
    else if (years < 3) totalDays = 10;
    else if (years < 5) totalDays = 14;
    else if (years < 10) totalDays = 15;
    else totalDays = Math.min(30, 15 + (years - 10));
  }

  // 將天數轉換為時數（每工作日8小時）
  const totalHours = totalDays * 8;
  const usedHours = 0; // 暫時設為 0，後續可從資料庫獲取
  const remainingHours = totalHours - usedHours;

  return { total: totalHours, used: usedHours, remaining: remainingHours };
}

/**
 * 格式化年資顯示
 */
export function formatYearsOfService(hireDate: Date): string {
  const now = dayjs();
  const start = dayjs(hireDate);
  const years = now.diff(start, 'year');
  const months = now.diff(start, 'month') % 12;

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
  let current = dayjs(startDate);
  const end = dayjs(endDate);

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    const dayOfWeek = current.day();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // 排除週日(0)和週六(6)
      count++;
    }
    current = current.add(1, 'day');
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
