
import React from 'react';

interface CalendarGridProps {
  daysInMonth: any[];
  onDateClick: (day: any) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const CalendarGrid = ({ daysInMonth, onDateClick, getScheduleCountForDate }: CalendarGridProps) => {
  return (
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
                onClick={() => onDateClick(day)}
                className={`w-full h-12 sm:h-16 flex flex-col items-center justify-center text-xs sm:text-sm transition-all hover:bg-gray-50 touch-manipulation relative ${
                  day.isWeekend ? 'text-red-500' : 'text-gray-900'
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {day.label}
                </span>
                {day.lunarDay && (
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                    {day.lunarDay}
                  </span>
                )}
                
                {/* 排班數量指示器 */}
                {day.date && getScheduleCountForDate(day.date) > 0 && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getScheduleCountForDate(day.date)}
                  </div>
                )}
              </button>
            ) : (
              <div className="w-full h-12 sm:h-16"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
