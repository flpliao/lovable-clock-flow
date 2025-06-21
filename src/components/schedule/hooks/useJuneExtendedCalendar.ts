
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, getDaysInMonth } from 'date-fns';

export const useJuneExtendedCalendar = (selectedDate: Date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // JavaScript month is 0-indexed
    
    // 檢查是否為六月
    const isJune = month === 6;
    
    let actualEndDate = monthEnd;
    
    // 六月特殊邏輯：如果六月份需要顯示完整週
    if (isJune) {
      const daysInJune = getDaysInMonth(selectedDate);
      const lastDayOfJune = new Date(year, 5, daysInJune); // 6月30日
      const lastDayOfWeek = getDay(lastDayOfJune); // 0=Sunday, 1=Monday, ..., 6=Saturday
      
      // 如果六月的最後一天不是星期六，則延伸到下週六
      if (lastDayOfWeek !== 6) {
        const daysToAdd = 6 - lastDayOfWeek;
        actualEndDate = addDays(lastDayOfJune, daysToAdd);
      }
    }
    
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: actualEndDate });

    // 計算開始的填充天數（對齊星期日為每週第一天）
    const startPadding = getDay(monthStart);
    const paddingDays = Array(startPadding).fill(null);
    
    // 創建日曆天數據
    const calendarDays = [
      ...paddingDays,
      ...daysInMonth.map(date => {
        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
        return {
          date,
          label: format(date, 'd'),
          lunarDay: '', // 可以添加農曆邏輯
          isWeekend: getDay(date) === 0 || getDay(date) === 6,
          isCurrentMonth, // 標記是否為當前月份
          isExtended: isJune && !isCurrentMonth // 標記是否為六月延伸的日期
        };
      })
    ];

    return {
      calendarDays,
      isJuneExtended: isJune,
      extendedEndDate: actualEndDate
    };
  }, [selectedDate]);
};
