
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, getDaysInMonth } from 'date-fns';

export const useExtendedCalendar = (selectedDate: Date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // JavaScript month is 0-indexed
    
    let actualEndDate = monthEnd;
    
    // 通用邏輯：如果任何月份的最後一天不是星期六，則延伸到下週六
    const daysInMonth = getDaysInMonth(selectedDate);
    const lastDayOfMonth = new Date(year, month - 1, daysInMonth);
    const lastDayOfWeek = getDay(lastDayOfMonth); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    // 如果月份的最後一天不是星期六，則延伸到下週六
    let isExtended = false;
    if (lastDayOfWeek !== 6) {
      const daysToAdd = 6 - lastDayOfWeek;
      actualEndDate = addDays(lastDayOfMonth, daysToAdd);
      isExtended = true;
    }
    
    const daysInCalendar = eachDayOfInterval({ start: monthStart, end: actualEndDate });

    // 計算開始的填充天數（對齊星期日為每週第一天）
    const startPadding = getDay(monthStart);
    const paddingDays = Array(startPadding).fill(null);
    
    // 創建日曆天數據
    const calendarDays = [
      ...paddingDays,
      ...daysInCalendar.map(date => {
        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
        return {
          date,
          label: format(date, 'd'),
          lunarDay: '', // 可以添加農曆邏輯
          isWeekend: getDay(date) === 0 || getDay(date) === 6,
          isCurrentMonth, // 標記是否為當前月份
          isExtended: isExtended && !isCurrentMonth // 標記是否為延伸的日期
        };
      })
    ];

    return {
      calendarDays,
      isExtended,
      extendedEndDate: actualEndDate
    };
  }, [selectedDate]);
};
