
import { getDaysInMonth, startOfMonth } from 'date-fns';
import { Lunar } from 'lunar-javascript';

// 獲取農曆日期
export const getLunarDate = (year: number, month: number, day: number) => {
  try {
    const lunar = Lunar.fromDate(new Date(year, month - 1, day));
    return lunar.getDayInChinese();
  } catch (error) {
    return '';
  }
};

// 生成該月份的日期
export const generateDaysInMonth = (selectedYear: string, selectedMonth: string) => {
  const year = parseInt(selectedYear);
  const month = parseInt(selectedMonth);
  const daysCount = getDaysInMonth(new Date(year, month - 1));
  const firstDay = startOfMonth(new Date(year, month - 1));
  const firstDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // 添加空白格子來對齊第一天
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // 添加該月的實際日期
  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(year, month - 1, i);
    const dayOfWeek = date.getDay();
    const dayName = ['日', '一', '二', '三', '四', '五', '六'][dayOfWeek];
    const lunarDay = getLunarDate(year, month, i);
    
    days.push({
      value: i.toString(),
      label: `${i}`,
      fullLabel: `${i}日 (${dayName})`,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      lunarDay: lunarDay,
    });
  }
  return days;
};

// 生成年份選項
export const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i <= currentYear + 2; i++) {
    years.push(i.toString());
  }
  return years;
};

// 生成月份選項
export const generateMonths = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1}月`,
  }));
};
