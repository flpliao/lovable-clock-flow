
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
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
      {/* 星期標題 */}
      <div className="grid grid-cols-7 border-b border-white/20">
        {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
          <div 
            key={day} 
            className={`text-center text-sm font-medium py-3 text-white/90 ${
              index === 0 || index === 6 ? 'text-red-300' : ''
            }`}
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* 日期網格 */}
      <div className="grid grid-cols-7">
        {daysInMonth.map((day, index) => (
          <div key={index} className="border-r border-b border-white/10 last:border-r-0">
            {day ? (
              <button
                type="button"
                onClick={() => onDateClick(day)}
                className={`w-full min-h-[80px] p-2 flex flex-col items-start justify-start text-sm transition-all hover:bg-white/20 ${
                  selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                    ? 'bg-white/40 text-white font-bold backdrop-blur-xl'
                    : day.isWeekend
                    ? 'text-red-300'
                    : 'text-white/90'
                }`}
              >
                <span className={`text-sm mb-1 ${
                  selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString() 
                    ? 'font-bold' : ''
                }`}>
                  {day.label}
                </span>
                {day.lunarDay && (
                  <span className={`text-xs mb-1 ${
                    selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                      ? 'text-white/80' 
                      : 'text-white/60'
                  }`}>
                    {day.lunarDay}
                  </span>
                )}
                {day.scheduleCount > 0 && (
                  <div className="text-xs bg-blue-500/60 text-white px-1 py-0.5 rounded">
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
