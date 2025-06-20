
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useScheduling } from '@/contexts/SchedulingContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUser } from '@/contexts/UserContext';
import { timeOptions } from '../constants';

type FormValues = {
  userId: string;
  selectedYear: string;
  selectedMonth: string;
  selectedDates: string[];
  selectedTimeSlots: string[];
};

export const useScheduleFormLogic = () => {
  const { toast } = useToast();
  const { addSchedules, loading, error } = useScheduling();
  const { staffList, getSubordinates } = useStaffManagementContext();
  const { currentUser } = useUser();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString());
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]); // 移除預設選擇
  
  const form = useForm<FormValues>({
    defaultValues: {
      userId: '',
      selectedYear: currentYear.toString(),
      selectedMonth: currentMonth.toString(),
      selectedDates: [],
      selectedTimeSlots: [], // 移除預設選擇
    },
  });

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  // 修改時間段選擇邏輯，確保一天只能選擇一個班次
  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        // 如果已選中，則取消選擇
        return prev.filter(t => t !== timeSlot);
      } else {
        // 如果未選中，則只選擇這一個時間段（替換之前的選擇）
        return [timeSlot];
      }
    });
  };

  const getUserName = (userId: string) => {
    const availableStaff = [];
    
    const selfStaff = staffList.find(staff => staff.id === currentUser?.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }
    
    if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
      const subordinates = getSubordinates(currentUser.id);
      availableStaff.push(...subordinates);
    }
    
    const user = availableStaff.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const scheduleData = selectedDates.flatMap(date => 
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
      );

      console.log('提交排班數據：', scheduleData);
      
      await addSchedules(scheduleData);
      
      const isForSelf = data.userId === currentUser?.id;
      const staffName = getUserName(data.userId);
      
      toast({
        title: "排班成功",
        description: `已為 ${staffName} 在 ${selectedYear}年${selectedMonth}月 安排 ${selectedDates.length} 天班次，共 ${selectedDates.length * selectedTimeSlots.length} 個時段。${isForSelf ? '' : '（代為排班）'}`,
      });
      
      setSelectedDates([]);
      setSelectedTimeSlots([]); // 清空時間段選擇
      form.reset();
    } catch (err) {
      console.error('排班提交失敗:', err);
      toast({
        title: "排班失敗",
        description: err instanceof Error ? err.message : "發生未知錯誤，請稍後重試",
        variant: "destructive",
      });
    }
  };

  return {
    form,
    selectedYear,
    selectedMonth,
    selectedDates,
    selectedTimeSlots,
    loading,
    error,
    setSelectedYear,
    setSelectedMonth,
    handleDateToggle,
    handleTimeSlotToggle,
    onSubmit,
  };
};
