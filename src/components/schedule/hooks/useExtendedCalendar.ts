
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, subDays, getDaysInMonth } from 'date-fns';

export const useExtendedCalendar = (selectedDate: Date) => {
  return useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1; // JavaScript month is 0-indexed
    
    // 處理月初：如果第一天不是星期日，則添加上個月的最後幾天
    let actualStartDate = monthStart;
    const firstDayOfWeek = getDay(monthStart); // 0=Sunday, 1=Monday, ..., 6=Saturday
    let hasStartExtension = false;
    
    if (firstDayOfWeek !== 0) {
      // 如果第一天不是星期日，則往前延伸到上個星期日
      actualStartDate = subDays(monthStart, firstDayOfWeek);
      hasStartExtension = true;
    }
    
    // 處理月末：如果最後一天不是星期六，則延伸到下週六
    let actualEndDate = monthEnd;
    const daysInMonth = getDaysInMonth(selectedDate);
    const lastDayOfMonth = new Date(year, month - 1, daysInMonth);
    const lastDayOfWeek = getDay(lastDayOfMonth); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    let hasEndExtension = false;
    if (lastDayOfWeek !== 6) {
      const daysToAdd = 6 - lastDayOfWeek;
      actualEndDate = addDays(lastDayOfMonth, daysToAdd);
      hasEndExtension = true;
    }
    
    const daysInCalendar = eachDayOfInterval({ start: actualStartDate, end: actualEndDate });
    
    // 創建日曆天數據
    const calendarDays = daysInCalendar.map(date => {
      const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
      const isPreviousMonth = date.getMonth() < selectedDate.getMonth() || 
                             (date.getMonth() === 11 && selectedDate.getMonth() === 0);
      const isNextMonth = date.getMonth() > selectedDate.getMonth() || 
                         (date.getMonth() === 0 && selectedDate.getMonth() === 11);
      
      return {
        date,
        label: format(date, 'd'),
        lunarDay: '', // 可以添加農曆邏輯
        isWeekend: getDay(date) === 0 || getDay(date) === 6,
        isCurrentMonth,
        isExtended: !isCurrentMonth, // 標記是否為延伸的日期（包含前後月份）
        isPreviousMonth,
        isNextMonth
      };
    });

    const isExtended = hasStartExtension || hasEndExtension;

    return {
      calendarDays,
      isExtended,
      hasStartExtension,
      hasEndExtension,
      extendedStartDate: actualStartDate,
      extendedEndDate: actualEndDate
    };
  }, [selectedDate]);
};
