import React from 'react';
import { generateDaysInMonth } from './utils/dateUtils';
import { Button } from '@/components/ui/button';

interface ScheduleCalendarProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  onDateToggle: (date: string) => void;
  onSelectAllMonth: () => void;
  onClearSelection: () => void;
}

const ScheduleCalendar = ({
  selectedYear,
  selectedMonth,
  selectedDates,
  onDateToggle,
  onSelectAllMonth,
  onClearSelection,
}: ScheduleCalendarProps) => {
  const daysInMonth = generateDaysInMonth(selectedYear, selectedMonth);

  return (
    <div>
      {/* 選擇操作按鈕 */}
      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSelectAllMonth}
          className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
        >
          全選當月
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearSelection}
          disabled={selectedDates.length === 0}
          className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          清除選擇
        </Button>
      </div>
      <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 shadow-lg overflow-hidden">
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
                  onClick={() => onDateToggle(day.value)}
                  className={`w-full h-16 flex flex-col items-center justify-center text-sm transition-all hover:bg-white/20 touch-manipulation ${
                    selectedDates.includes(day.value)
                      ? 'bg-white/40 text-white font-bold backdrop-blur-xl hover:bg-white/50'
                      : day.isWeekend
                        ? 'text-red-300'
                        : 'text-white/90'
                  }`}
                >
                  <span
                    className={`text-sm ${selectedDates.includes(day.value) ? 'font-bold' : ''}`}
                  >
                    {day.label}
                  </span>
                  {day.lunarDay && (
                    <span
                      className={`text-xs mt-0.5 ${
                        selectedDates.includes(day.value) ? 'text-white/80' : 'text-white/60'
                      }`}
                    >
                      {day.lunarDay}
                    </span>
                  )}
                </button>
              ) : (
                <div className="w-full h-16"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDates.length > 0 && (
        <div className="mt-4 p-3 bg-white/20 backdrop-blur-xl rounded-xl text-sm text-white border border-white/30">
          已選擇 {selectedDates.length} 天：
          {selectedDates.sort((a, b) => parseInt(a) - parseInt(b)).join('、')}日
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;
