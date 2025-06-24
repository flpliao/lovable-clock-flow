
import React from 'react';

interface CalendarGridProps {
  selectedDate: Date;
  daysInMonth: any[];
  onDateClick: (day: any) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  selectedDate,
  daysInMonth,
  onDateClick,
}) => {
  return (
    <div className="backdrop-blur-2xl bg-gradient-to-br from-white/75 to-white/55 border border-white/40 rounded-2xl shadow-lg overflow-hidden">
      {/* 星期標題 */}
      <div className="grid grid-cols-7 border-b border-gray-300/50 bg-gradient-to-r from-white/60 to-white/40">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div 
            key={day} 
            className={`text-center text-sm font-semibold py-4 ${
              index === 0 || index === 6 ? 'text-red-600' : 'text-gray-700'
            } drop-shadow-sm`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期網格 */}
      <div className="grid grid-cols-7">
        {daysInMonth.map((day, index) => (
          <div key={index} className="border-r border-b border-gray-200/50 last:border-r-0">
            {day ? (
              <button
                type="button"
                onClick={() => onDateClick(day)}
                className={`w-full min-h-[80px] p-3 flex flex-col items-start justify-start text-sm transition-all duration-200 hover:bg-white/60 hover:backdrop-blur-xl hover:shadow-md ${
                  selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                    ? 'bg-gradient-to-br from-blue-500/20 to-blue-400/10 text-blue-800 font-bold shadow-inner border-2 border-blue-400/30'
                    : day.isWeekend
                    ? 'text-red-500 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <span className={`text-sm mb-1 ${
                  selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString() 
                    ? 'font-bold text-blue-800' : ''
                }`}>
                  {day.label}
                </span>
                {day.lunarDay && (
                  <span className={`text-xs mb-1 ${
                    selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                      ? 'text-blue-700/80' 
                      : 'text-gray-500'
                  }`}>
                    {day.lunarDay}
                  </span>
                )}
                {day.scheduleCount > 0 && (
                  <div className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full shadow-sm font-medium">
                    {day.scheduleCount}班
                  </div>
                )}
              </button>
            ) : (
              <div className="w-full min-h-[80px]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
