
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { isSameDay } from 'date-fns';

interface CalendarGridProps {
  selectedYear: string;
  selectedMonth: string;
  selectedDate: Date;
  daysInMonth: any[];
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onDateClick: (day: any) => void;
  generateYears: () => string[];
  generateMonths: () => { value: string; label: string; }[];
}

const CalendarGrid = ({
  selectedYear,
  selectedMonth,
  selectedDate,
  daysInMonth,
  onYearChange,
  onMonthChange,
  onDateClick,
  generateYears,
  generateMonths,
}: CalendarGridProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>選擇日期</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 年月選擇 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generateYears().map(year => (
                  <SelectItem key={year} value={year}>
                    {year}年
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={selectedMonth} onValueChange={onMonthChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generateMonths().map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 日曆網格 */}
        <div>
          <div className="text-lg font-medium mb-4 text-center">
            {selectedYear}年 {selectedMonth}月
          </div>
          <div className="bg-white rounded-lg border border-gray-200">
            {/* 星期標題 */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                <div 
                  key={day} 
                  className={`text-center text-sm font-medium py-3 ${
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
                      className={`w-full h-16 flex flex-col items-center justify-center text-sm transition-all hover:bg-gray-50 ${
                        isSameDay(day.date, selectedDate)
                          ? 'bg-blue-500 text-white font-medium hover:bg-blue-600'
                          : day.isWeekend
                          ? 'text-red-500'
                          : 'text-gray-900'
                      }`}
                    >
                      <span className={`text-sm ${isSameDay(day.date, selectedDate) ? 'font-bold' : ''}`}>
                        {day.label}
                      </span>
                      {day.lunarDay && (
                        <span className={`text-xs mt-0.5 ${
                          isSameDay(day.date, selectedDate) 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}>
                          {day.lunarDay}
                        </span>
                      )}
                      {day.scheduleCount > 0 && (
                        <span className={`text-xs mt-0.5 ${
                          isSameDay(day.date, selectedDate) 
                            ? 'text-blue-100' 
                            : 'text-green-600'
                        } font-medium`}>
                          {day.scheduleCount}人
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarGrid;
