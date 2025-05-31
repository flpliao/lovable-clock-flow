
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface WeekOverviewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const WeekOverview = ({ selectedDate, onDateSelect, getScheduleCountForDate }: WeekOverviewProps) => {
  // 獲取當週日期
  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(start, i));
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>週排班概覽</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day, index) => {
            const scheduleCount = getScheduleCountForDate(day);
            return (
              <div 
                key={index}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  isSameDay(day, selectedDate) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => onDateSelect(day)}
              >
                <div className="text-xs mb-1">{format(day, 'E', { locale: zhTW })}</div>
                <div className="font-medium">{format(day, 'd')}</div>
                <div className={`text-xs mt-2 ${scheduleCount > 0 ? 'text-green-600 font-medium' : ''}`}>
                  {scheduleCount} 人
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeekOverview;
