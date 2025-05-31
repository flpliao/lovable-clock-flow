import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, getDaysInMonth, startOfMonth } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Lunar } from 'lunar-javascript';

// 模擬的用戶數據
const mockUsers = [
  { id: '1', name: '王小明', position: '主管', department: '人資部' },
  { id: '2', name: '李小華', position: '工程師', department: '技術部' },
  { id: '3', name: '張小美', position: '設計師', department: '設計部' },
];

const ScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'self' | 'subordinates' | 'all'>('self');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  
  const { schedules, getSchedulesForDate, removeSchedule } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  console.log('ScheduleCalendar - All schedules:', schedules);
  
  // 獲取可查看的員工ID列表
  const getViewableStaffIds = () => {
    if (!currentUser) return [];
    
    const viewableIds = [];
    
    switch (viewMode) {
      case 'self':
        viewableIds.push(currentUser.id);
        break;
      case 'subordinates':
        if (currentUser.role === 'admin' || currentUser.role === 'manager') {
          const subordinates = getSubordinates(currentUser.id);
          viewableIds.push(...subordinates.map(s => s.id));
        }
        break;
      case 'all':
        viewableIds.push(currentUser.id);
        if (currentUser.role === 'admin' || currentUser.role === 'manager') {
          const subordinates = getSubordinates(currentUser.id);
          viewableIds.push(...subordinates.map(s => s.id));
        }
        break;
    }
    
    return viewableIds;
  };

  const viewableStaffIds = getViewableStaffIds();
  
  // 過濾排班記錄
  const getFilteredSchedulesForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const allSchedules = getSchedulesForDate(dateString);
    return allSchedules.filter(schedule => viewableStaffIds.includes(schedule.userId));
  };

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const shiftsForSelectedDate = getFilteredSchedulesForDate(selectedDate);
  
  console.log('ScheduleCalendar - Selected date:', selectedDateString);
  console.log('ScheduleCalendar - Filtered shifts for selected date:', shiftsForSelectedDate);

  // 獲取用戶名稱
  const getUserName = (userId: string) => {
    const user = staffList.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  // 獲取用戶關係標記
  const getUserRelation = (userId: string) => {
    if (!currentUser) return '';
    if (userId === currentUser.id) return '自己';
    if (getSubordinates(currentUser.id).some(s => s.id === userId)) return '下屬';
    return '';
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

  // 獲取某日期的排班數量（已過濾）
  const getScheduleCountForDate = (date: Date) => {
    const filteredSchedules = getFilteredSchedulesForDate(date);
    const count = filteredSchedules.length;
    console.log(`ScheduleCalendar - Date ${format(date, 'yyyy-MM-dd')} has ${count} filtered schedules`);
    return count;
  };

  // 刪除排班
  const handleRemoveSchedule = (scheduleId: string) => {
    removeSchedule(scheduleId);
    toast({
      title: '刪除成功',
      description: '排班記錄已刪除',
    });
  };

  // 檢查是否可以刪除排班
  const canDeleteSchedule = (schedule: any) => {
    if (!currentUser) return false;
    // 管理員可以刪除所有排班，員工只能刪除自己的排班
    return currentUser.role === 'admin' || schedule.userId === currentUser.id;
  };

  // 生成年份選項
  const generateYears = () => {
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 2; i++) {
      years.push(i.toString());
    }
    return years;
  };

  // 生成月份選項
  const generateMonths = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}月`,
    }));
  };

  // 獲取農曆日期
  const getLunarDate = (year: number, month: number, day: number) => {
    try {
      const lunar = Lunar.fromDate(new Date(year, month - 1, day));
      return lunar.getDayInChinese();
    } catch (error) {
      return '';
    }
  };

  // 生成該月份的日期
  const generateDaysInMonth = () => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const daysCount = getDaysInMonth(new Date(year, month - 1));
    const firstDay = startOfMonth(new Date(year, month - 1));
    const firstDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // 添加空白格子來對齊第一天
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 添加該月的實際日期
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(year, month - 1, i);
      const dayOfWeek = date.getDay();
      const dayName = ['日', '一', '二', '三', '四', '五', '六'][dayOfWeek];
      const lunarDay = getLunarDate(year, month, i);
      const scheduleCount = getScheduleCountForDate(date);
      
      days.push({
        value: i.toString(),
        label: `${i}`,
        fullLabel: `${i}日 (${dayName})`,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        lunarDay: lunarDay,
        scheduleCount: scheduleCount,
        date: date,
      });
    }
    return days;
  };

  const handleDateClick = (day: any) => {
    if (day && day.date) {
      setSelectedDate(day.date);
    }
  };

  const daysInMonth = generateDaysInMonth();

  // 檢查是否為主管
  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
  const hasSubordinates = isManager && getSubordinates(currentUser?.id || '').length > 0;

  return (
    <div className="space-y-4">
      {/* 查看模式選擇器 */}
      {hasSubordinates && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              查看範圍
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={viewMode} onValueChange={(value: 'self' | 'subordinates' | 'all') => setViewMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">僅自己的排班</SelectItem>
                <SelectItem value="subordinates">僅下屬的排班</SelectItem>
                <SelectItem value="all">自己和下屬的排班</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* 日曆式日期選擇器 */}
      <Card>
        <CardHeader>
          <CardTitle>選擇日期</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 年月選擇 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
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
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
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
                        onClick={() => handleDateClick(day)}
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
      
      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, 'yyyy年MM月dd日', { locale: zhTW })} 排班表
            {shiftsForSelectedDate.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                ({shiftsForSelectedDate.length} 個班次)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shiftsForSelectedDate.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>員工</TableHead>
                  <TableHead>關係</TableHead>
                  <TableHead>時間段</TableHead>
                  <TableHead>開始時間</TableHead>
                  <TableHead>結束時間</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftsForSelectedDate.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">{getUserName(shift.userId)}</TableCell>
                    <TableCell>
                      <Badge variant={shift.userId === currentUser?.id ? 'default' : 'secondary'}>
                        {getUserRelation(shift.userId)}
                      </Badge>
                    </TableCell>
                    <TableCell>{shift.timeSlot}</TableCell>
                    <TableCell>{shift.startTime}</TableCell>
                    <TableCell>{shift.endTime}</TableCell>
                    <TableCell>
                      {canDeleteSchedule(shift) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSchedule(shift.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">該日期沒有排班記錄</div>
              <div className="text-sm text-gray-400">
                總共有 {schedules.filter(s => viewableStaffIds.includes(s.userId)).length} 個排班記錄在當前查看範圍內
              </div>
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
                  onClick={() => setSelectedDate(day)}
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

      {/* 調試信息 */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">調試信息</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-700">
            <div>總排班數量: {schedules.length}</div>
            <div>可查看排班數量: {schedules.filter(s => viewableStaffIds.includes(s.userId)).length}</div>
            <div>選定日期: {selectedDateString}</div>
            <div>該日期排班數量: {shiftsForSelectedDate.length}</div>
            <div>查看模式: {viewMode}</div>
            <div>可查看員工ID: {viewableStaffIds.join(', ')}</div>
            {schedules.length > 0 && (
              <div className="mt-2">
                <div>所有排班日期:</div>
                <div className="text-xs">
                  {[...new Set(schedules.map(s => s.workDate))].sort().join(', ')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScheduleCalendar;
