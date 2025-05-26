
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useScheduling } from '@/contexts/SchedulingContext';

// 模擬的用戶數據
const mockUsers = [
  { id: '1', name: '王小明', position: '主管', department: '人資部' },
  { id: '2', name: '李小華', position: '工程師', department: '技術部' },
  { id: '3', name: '張小美', position: '設計師', department: '設計部' },
];

const ScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { schedules, getSchedulesForDate } = useScheduling();
  
  // 獲取選定日期的排班
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const shiftsForSelectedDate = getSchedulesForDate(selectedDateString);

  // 獲取用戶名稱
  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

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

  // 獲取某日期的排班數量
  const getScheduleCountForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return getSchedulesForDate(dateString).length;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>選擇日期</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
            locale={zhTW}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })} 排班表
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shiftsForSelectedDate.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>員工</TableHead>
                  <TableHead>時間段</TableHead>
                  <TableHead>開始時間</TableHead>
                  <TableHead>結束時間</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftsForSelectedDate.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell>{getUserName(shift.userId)}</TableCell>
                    <TableCell>{shift.timeSlot}</TableCell>
                    <TableCell>{shift.startTime}</TableCell>
                    <TableCell>{shift.endTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4 text-gray-500">
              該日期沒有排班記錄
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>週排班概覽</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center">
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`p-2 rounded-md cursor-pointer ${
                  isSameDay(day, selectedDate) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-xs mb-1">{format(day, 'E', { locale: zhTW })}</div>
                <div className="font-medium">{format(day, 'd')}</div>
                <div className="text-xs mt-2">
                  {getScheduleCountForDate(day)} 人
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleCalendar;
