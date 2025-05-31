
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { generateDaysInMonth } from './utils/dateUtils';

interface ScheduleCalendarProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  onDateToggle: (date: string) => void;
}

const ScheduleCalendar = ({ selectedYear, selectedMonth, selectedDates, onDateToggle }: ScheduleCalendarProps) => {
  const daysInMonth = generateDaysInMonth(selectedYear, selectedMonth);

  return (
    <div>
      <FormLabel className="text-sm sm:text-lg font-medium mb-3 sm:mb-4 block">
        {selectedYear}年 {selectedMonth}月
      </FormLabel>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* 星期標題 */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center text-xs sm:text-sm font-medium py-2 sm:py-3 ${
                index === 0 || index === 6 ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* 日期網格 */}
        <div className="grid grid-cols-7">
          {daysInMonth.map((day, index) => (
            <div key={index} className="border-r border-b border-gray-50 last:border-r-0">
              {day ? (
                <button
                  type="button"
                  onClick={() => onDateToggle(day.value)}
                  className={`w-full h-12 sm:h-16 flex flex-col items-center justify-center text-xs sm:text-sm transition-all hover:bg-gray-50 touch-manipulation ${
                    selectedDates.includes(day.value)
                      ? 'bg-blue-500 text-white font-medium hover:bg-blue-600'
                      : day.isWeekend
                      ? 'text-red-500'
                      : 'text-gray-900'
                  }`}
                >
                  <span className={`text-xs sm:text-sm ${selectedDates.includes(day.value) ? 'font-bold' : ''}`}>
                    {day.label}
                  </span>
                  {day.lunarDay && (
                    <span className={`text-[10px] sm:text-xs mt-0.5 ${
                      selectedDates.includes(day.value) 
                        ? 'text-blue-100' 
                        : 'text-gray-500'
                    }`}>
                      {day.lunarDay}
                    </span>
                  )}
                </button>
              ) : (
                <div className="w-full h-12 sm:h-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {selectedDates.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs sm:text-sm text-blue-700 border border-blue-200">
          已選擇 {selectedDates.length} 天：{selectedDates.sort((a, b) => parseInt(a) - parseInt(b)).join('、')}日
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
