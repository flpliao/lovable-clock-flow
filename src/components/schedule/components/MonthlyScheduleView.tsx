
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface MonthlyScheduleViewProps {
  selectedDate: Date;
  schedules: any[];
  getUserName: (userId: string) => string;
  selectedStaffId?: string;
}

const MonthlyScheduleView = ({ 
  selectedDate, 
  schedules, 
  getUserName, 
  selectedStaffId 
}: MonthlyScheduleViewProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 如果選擇了特定員工，過濾排班記錄
  const filteredSchedules = selectedStaffId 
    ? schedules.filter(schedule => schedule.userId === selectedStaffId)
    : schedules;

  // 獲取某一天的排班記錄
  const getSchedulesForDay = (day: Date) => {
    const dayString = format(day, 'yyyy-MM-dd');
    return filteredSchedules.filter(schedule => schedule.workDate === dayString);
  };

  // 補齊月份開始前的空白天數（讓週日為第一天）
  const startPadding = getDay(monthStart);
  const paddingDays = Array(startPadding).fill(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {format(selectedDate, 'yyyy年MM月', { locale: zhTW })} 排班總覽
          {selectedStaffId && (
            <span className="ml-2 text-base text-gray-600">
              - {getUserName(selectedStaffId)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* 星期標題 */}
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center text-sm font-medium py-2 ${
                index === 0 || index === 6 ? 'text-red-500' : 'text-gray-700'
              }`}
            >
              {day}
            </div>
          ))}
          
          {/* 月初空白天數 */}
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="h-24"></div>
          ))}
          
          {/* 實際日期 */}
          {daysInMonth.map((day) => {
            const daySchedules = getSchedulesForDay(day);
            const isWeekend = getDay(day) === 0 || getDay(day) === 6;
            
            return (
              <div 
                key={day.toISOString()} 
                className={`border border-gray-200 h-24 p-1 ${
                  isWeekend ? 'bg-red-50' : 'bg-white'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isWeekend ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {daySchedules.map((schedule, index) => (
                    <Badge 
                      key={schedule.id}
                      variant="secondary" 
                      className="text-xs px-1 py-0 h-auto block truncate"
                      title={`${getUserName(schedule.userId)} - ${schedule.timeSlot}`}
                    >
                      {selectedStaffId ? schedule.timeSlot : getUserName(schedule.userId)}
                    </Badge>
                  ))}
                  {daySchedules.length > 2 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{daySchedules.length - 2}更多
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyScheduleView;
