
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, getDaysInMonth, startOfMonth } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

// 模擬的用戶數據
const mockUsers = [
  { id: '1', name: '王小明', position: '主管', department: '人資部' },
  { id: '2', name: '李小華', position: '工程師', department: '技術部' },
  { id: '3', name: '張小美', position: '設計師', department: '設計部' },
];

// 時間選項
const timeOptions = [
  { label: '早班 (09:30-17:30)', value: '09:30-17:30', start: '09:30', end: '17:30' },
  { label: '中班 (13:00-21:00)', value: '13:00-21:00', start: '13:00', end: '21:00' },
  { label: '晚班 (21:00-05:00)', value: '21:00-05:00', start: '21:00', end: '05:00' },
  { label: '全日 (09:00-18:00)', value: '09:00-18:00', start: '09:00', end: '18:00' },
];

type FormValues = {
  userId: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
};

const ScheduleForm = () => {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['09:30-17:30']); // 預設早班
  
  const form = useForm<FormValues>({
    defaultValues: {
      userId: '',
      selectedYear: currentYear.toString(),
      selectedMonth: currentMonth.toString(),
      selectedDates: [],
      selectedTimeSlots: ['09:30-17:30'],
    },
  });

  // 生成年份選項
  const generateYears = () => {
    const years = [];
    for (let i = currentYear; i <= currentYear + 2; i++) {
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

  // 生成該月份的日期
  const generateDaysInMonth = () => {
    const year = parseInt(selectedYear);
    const month = parseInt(selectedMonth);
    const daysCount = getDaysInMonth(new Date(year, month - 1));
    const firstDay = startOfMonth(new Date(year, month - 1));
    
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(year, month - 1, i);
      const dayOfWeek = date.getDay();
      const dayName = ['日', '一', '二', '三', '四', '五', '六'][dayOfWeek];
      
      days.push({
        value: i.toString(),
        label: `${i}日 (${dayName})`,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      });
    }
    return days;
  };

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(timeSlot) 
        ? prev.filter(t => t !== timeSlot)
        : [...prev, timeSlot]
    );
  };

  const onSubmit = (data: FormValues) => {
    const scheduleData = {
      userId: data.userId,
      year: selectedYear,
      month: selectedMonth,
      selectedDates,
      selectedTimeSlots,
      schedules: selectedDates.flatMap(date => 
        selectedTimeSlots.map(timeSlot => {
          const timeOption = timeOptions.find(opt => opt.value === timeSlot);
          return {
            workDate: `${selectedYear}-${selectedMonth.padStart(2, '0')}-${date.padStart(2, '0')}`,
            startTime: timeOption?.start || '09:30',
            endTime: timeOption?.end || '17:30',
            timeSlot: timeSlot,
          };
        })
      ),
    };

    console.log('排班數據：', scheduleData);
    
    toast({
      title: "排班成功",
      description: `已為 ${getUserName(data.userId)} 在 ${selectedYear}年${selectedMonth}月 安排 ${selectedDates.length} 天班次，共 ${selectedDates.length * selectedTimeSlots.length} 個時段。`,
    });
    
    // 重置表單
    setSelectedDates([]);
    setSelectedTimeSlots(['09:30-17:30']);
    form.reset();
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  const daysInMonth = generateDaysInMonth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>創建新排班</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>選擇員工</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="選擇員工" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} - {user.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 年月選擇 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel>選擇年份</FormLabel>
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
                <FormLabel>選擇月份</FormLabel>
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

            {/* 日期選擇 */}
            <div>
              <FormLabel className="text-base font-medium">
                選擇工作日期 ({selectedYear}年{selectedMonth}月)
              </FormLabel>
              <div className="mt-3 max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50">
                <div className="grid grid-cols-4 gap-2">
                  {daysInMonth.map(day => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`date-${day.value}`}
                        checked={selectedDates.includes(day.value)}
                        onCheckedChange={() => handleDateToggle(day.value)}
                      />
                      <label
                        htmlFor={`date-${day.value}`}
                        className={`text-sm cursor-pointer ${
                          day.isWeekend ? 'text-red-500' : 'text-gray-700'
                        }`}
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedDates.length > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    已選擇 {selectedDates.length} 天：{selectedDates.sort((a, b) => parseInt(a) - parseInt(b)).join('、')}日
                  </div>
                )}
              </div>
            </div>

            {/* 時間段選擇 */}
            <div>
              <FormLabel className="text-base font-medium">選擇時間段</FormLabel>
              <div className="mt-3 space-y-3">
                {timeOptions.map(timeOption => (
                  <div key={timeOption.value} className="flex items-center space-x-3">
                    <Checkbox
                      id={`time-${timeOption.value}`}
                      checked={selectedTimeSlots.includes(timeOption.value)}
                      onCheckedChange={() => handleTimeSlotToggle(timeOption.value)}
                    />
                    <label
                      htmlFor={`time-${timeOption.value}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {timeOption.label}
                    </label>
                  </div>
                ))}
                {selectedTimeSlots.length > 0 && (
                  <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
                    已選擇 {selectedTimeSlots.length} 個時間段
                  </div>
                )}
              </div>
            </div>

            {/* 排班總結 */}
            {selectedDates.length > 0 && selectedTimeSlots.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">排班預覽</h4>
                <p className="text-sm text-gray-600">
                  將為選定員工在 {selectedYear}年{selectedMonth}月 安排：
                </p>
                <ul className="text-sm text-gray-600 mt-1 ml-4">
                  <li>• 工作日期：{selectedDates.length} 天</li>
                  <li>• 時間段：{selectedTimeSlots.length} 個</li>
                  <li>• 總排班次數：{selectedDates.length * selectedTimeSlots.length} 次</li>
                </ul>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={!form.watch('userId') || selectedDates.length === 0 || selectedTimeSlots.length === 0}
            >
              提交排班
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
