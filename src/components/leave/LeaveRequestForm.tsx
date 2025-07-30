import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useLeaveType } from '@/hooks/useLeaveType';
import { useMyLeaveRequest } from '@/hooks/useMyLeaveRequest';
import { cn } from '@/lib/utils';
import useEmployeeStore from '@/stores/employeeStore';
import { LeaveTypeCode } from '@/types/leaveType';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';

interface LeaveRequestFormProps {
  onSuccess?: () => void;
}

export function LeaveRequestForm({ onSuccess }: LeaveRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { leaveTypes, loadLeaveTypes, getLeaveTypeBySlug } = useLeaveType();
  const { createMyLeaveRequest } = useMyLeaveRequest();
  const { employee } = useEmployeeStore();

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: '',
    },
  });

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const watchedLeaveType = form.watch('leave_type');

  const handleFormSubmit = async (data: LeaveFormValues) => {
    if (!employee) {
      toast({
        title: '錯誤',
        description: '請先登入系統',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // 計算請假天數
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // 包含開始和結束日期
      const hours = daysDiff * 8; // 假設每天8小時

      // 準備請假申請資料
      const leaveRequestData = {
        employee_id: employee.slug,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: format(data.end_date, 'yyyy-MM-dd'),
        leave_type_id: data.leave_type,
        duration_hours: hours,
        reason: data.reason,
        status: 'pending' as const,
      };

      await createMyLeaveRequest(leaveRequestData);

      toast({
        title: '申請成功',
        description: '請假申請已提交，等待審核',
      });

      // 重置表單
      form.reset();

      // 通知父元件
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('❌ 提交請假申請失敗:', error);
      toast({
        title: '申請失敗',
        description: '提交請假申請時發生錯誤',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasStartDate = Boolean(employee?.start_date);
  const isDisabled = !employee;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 請假類型選擇 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
          <FormField
            control={form.control}
            name="leave_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">假別</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60">
                      <SelectValue placeholder="請選擇請假類型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leaveTypes.map(type => {
                      const isTypeDisabled = !hasStartDate && type.code === LeaveTypeCode.ANNUAL;

                      return (
                        <SelectItem key={type.slug} value={type.slug} disabled={isTypeDisabled}>
                          {type.name}
                          {isTypeDisabled && (
                            <span className="text-orange-500 ml-2">（需設定到職日期）</span>
                          )}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 請假類型詳細資訊 */}
        {watchedLeaveType && getLeaveTypeBySlug(watchedLeaveType) && (
          <LeaveTypeDetailCard leaveType={getLeaveTypeBySlug(watchedLeaveType)!} />
        )}

        {/* 請假日期 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white font-medium">開始日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30',
                            !field.value && 'text-white/60'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'yyyy/MM/dd')
                          ) : (
                            <span>選擇開始日期</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => {
                          // 計算6個月前的日期作為最早可選日期
                          const sixMonthsAgo = new Date();
                          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                          sixMonthsAgo.setHours(0, 0, 0, 0);

                          // 計算1年後的日期作為最晚可選日期
                          const oneYearLater = new Date();
                          oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                          oneYearLater.setHours(23, 59, 59, 999);

                          return date < sixMonthsAgo || date > oneYearLater;
                        }}
                        initialFocus
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white font-medium">結束日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30',
                            !field.value && 'text-white/60'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'yyyy/MM/dd')
                          ) : (
                            <span>選擇結束日期</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date => {
                          // 計算6個月前的日期作為最早可選日期
                          const sixMonthsAgo = new Date();
                          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                          sixMonthsAgo.setHours(0, 0, 0, 0);

                          // 計算1年後的日期作為最晚可選日期
                          const oneYearLater = new Date();
                          oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                          oneYearLater.setHours(23, 59, 59, 999);

                          return date < sixMonthsAgo || date > oneYearLater;
                        }}
                        initialFocus
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 請假原因 */}
        </div>

        {/* 請假原因 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假原因</h3>
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">事由說明</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="請輸入請假事由..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60 resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 提交按鈕 */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || isDisabled}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              '提交申請'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
