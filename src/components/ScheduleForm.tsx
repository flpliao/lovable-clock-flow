
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { timeOptions } from './schedule/constants';
import ScheduleCalendar from './schedule/ScheduleCalendar';
import TimeSlotSelector from './schedule/TimeSlotSelector';
import SchedulePreview from './schedule/SchedulePreview';
import YearMonthSelector from './schedule/YearMonthSelector';

type FormValues = {
  userId: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
};

const ScheduleForm = () => {
  const { toast } = useToast();
  const { addSchedules } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['09:30-17:30']);
  
  const form = useForm<FormValues>({
    defaultValues: {
      userId: '',
      selectedYear: currentYear.toString(),
      selectedMonth: currentMonth.toString(),
      selectedDates: [],
      selectedTimeSlots: ['09:30-17:30'],
    },
  });

  // 獲取可排班的員工列表（包含自己和下屬）
  const getAvailableStaff = () => {
    if (!currentUser) return [];
    
    const availableStaff = [];
    
    // 自己可以為自己排班
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
    // 如果是主管，可以為下屬排班
    if (currentUser.role === 'admin' || currentUser.role === 'manager') {
      const subordinates = getSubordinates(currentUser.id);
      availableStaff.push(...subordinates);
    }
    
    // 去重並排序
    const uniqueStaff = availableStaff.filter((staff, index, self) => 
      index === self.findIndex(s => s.id === staff.id)
    );
    
    return uniqueStaff.sort((a, b) => {
      // 自己排在最前面
      if (a.id === currentUser.id) return -1;
      if (b.id === currentUser.id) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const availableStaff = getAvailableStaff();

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
            userId: data.userId,
            workDate: `${selectedYear}-${selectedMonth.padStart(2, '0')}-${date.padStart(2, '0')}`,
            startTime: timeOption?.start || '09:30',
            endTime: timeOption?.end || '17:30',
            timeSlot: timeSlot,
          };
        })
      ),
    };

    console.log('排班數據：', scheduleData);
    
    addSchedules(scheduleData.schedules);
    
    const isForSelf = data.userId === currentUser?.id;
    const staffName = getUserName(data.userId);
    
    toast({
      title: "排班成功",
      description: `已為 ${staffName} 在 ${selectedYear}年${selectedMonth}月 安排 ${selectedDates.length} 天班次，共 ${selectedDates.length * selectedTimeSlots.length} 個時段。${isForSelf ? '' : '（代為排班）'}`,
    });
    
    setSelectedDates([]);
    setSelectedTimeSlots(['09:30-17:30']);
    form.reset();
  };

  const getUserName = (userId: string) => {
    const user = availableStaff.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  const getStaffRelation = (staffId: string) => {
    if (staffId === currentUser?.id) return '（自己）';
    if (getSubordinates(currentUser?.id || '').some(s => s.id === staffId)) return '（下屬）';
    return '';
  };

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
                      {availableStaff.length > 0 ? (
                        availableStaff.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name} - {staff.department} ({staff.position}) {getStaffRelation(staff.id)}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-staff" disabled>
                          暫無可排班員工
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <YearMonthSelector
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />

            <ScheduleCalendar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              selectedDates={selectedDates}
              onDateToggle={handleDateToggle}
            />

            <TimeSlotSelector
              selectedTimeSlots={selectedTimeSlots}
              onTimeSlotToggle={handleTimeSlotToggle}
            />

            <SchedulePreview
              selectedDates={selectedDates}
              selectedTimeSlots={selectedTimeSlots}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />

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
