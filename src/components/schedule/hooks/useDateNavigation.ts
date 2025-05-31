
import { useState } from 'react';
import { getDaysInMonth, startOfMonth } from 'date-fns';
import { Lunar } from 'lunar-javascript';

export const useDateNavigation = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 獲取農曆日期
  const getLunarDate = (year: number, month: number, day: number) => {
    try {
      const lunar = Lunar.fromDate(new Date(year, month - 1, day));
      return lunar.getDayInChinese();
    } catch (error) {
      return '';
    }
  };

  // 生成該月份的日期
  const generateDaysInMonth = (getScheduleCountForDate: (date: Date) => number) => {
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
      const scheduleCount = getScheduleCountForDate(date);
      
      days.push({
        value: i.toString(),
        label: `${i}`,
        fullLabel: `${i}日 (${dayName})`,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        lunarDay: lunarDay,
        scheduleCount: scheduleCount,
        date: date,
      });
    }
    return days;
  };

  // 生成年份選項
  const generateYears = () => {
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i.toString());
    }
    return years;
  };

  // 生成月份選項
  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}月`,
    }));
  };

  return {
    selectedYear,
    selectedMonth,
    selectedDate,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDate,
    generateDaysInMonth,
    generateYears,
    generateMonths,
  };
};
