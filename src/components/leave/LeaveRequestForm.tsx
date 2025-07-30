import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLeaveType } from '@/hooks/useLeaveType';
import { useMyLeaveRequest } from '@/hooks/useMyLeaveRequest';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import {
  leaveRequestFormSchema,
  LeaveRequestFormValues,
  LeaveRequestStatus,
} from '@/types/leaveRequest';
import { LeaveTypeCode } from '@/types/leaveType';
import { calculateHoursBetween } from '@/utils/dateTimeUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';

interface LeaveRequestFormProps {
  onSuccess?: () => void;
}

export function LeaveRequestForm({ onSuccess }: LeaveRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { leaveTypes, loadLeaveTypes } = useLeaveType();
  const getLeaveTypeBySlug = useLeaveTypeStore(state => state.getLeaveTypeBySlug);
  const { createMyLeaveRequest } = useMyLeaveRequest();
  const { employee } = useEmployeeStore();

  const form = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestFormSchema),
    defaultValues: {
      reason: '',
      status: LeaveRequestStatus.PENDING,
    },
  });

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const watchedLeaveType = form.watch('leave_type_code');
  const watchedStartDate = form.watch('start_date');
  const watchedEndDate = form.watch('end_date');

  const currentLeaveType = useMemo(() => {
    return watchedLeaveType ? getLeaveTypeBySlug(watchedLeaveType) : null;
  }, [watchedLeaveType, getLeaveTypeBySlug]);

  // 計算請假時數（當開始和結束日期都存在時）
  const calculatedHours = useMemo(() => {
    if (watchedStartDate && watchedEndDate) {
      const startDateTime = dayjs(watchedStartDate);
      const endDateTime = dayjs(watchedEndDate);
      return calculateHoursBetween(startDateTime, endDateTime);
    }
    return 0;
  }, [watchedStartDate, watchedEndDate]);

  const handleFormSubmit = async (data: LeaveRequestFormValues) => {
    setIsSubmitting(true);

    // 準備請假申請資料
    const leaveRequestData = {
      start_date: data.start_date.format('YYYY-MM-DD HH:mm:ss'),
      end_date: data.end_date.format('YYYY-MM-DD HH:mm:ss'),
      leave_type_code: currentLeaveType.code,
      duration_hours: calculatedHours,
      reason: data.reason,
      status: LeaveRequestStatus.PENDING,
    };

    await createMyLeaveRequest(leaveRequestData);
    if (onSuccess) {
      onSuccess();
    }

    // 重置表單
    form.reset();
    setIsSubmitting(false);
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
            name="leave_type_code"
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
        {currentLeaveType && <LeaveTypeDetailCard leaveType={currentLeaveType} />}

        {/* 請假日期時間 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期時間</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white font-medium">開始日期時間</FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      step="1800"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/30 transition-colors duration-200"
                      value={field.value ? field.value.format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={e => {
                        const date = e.target.value ? dayjs(e.target.value) : null;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-white font-medium">結束日期時間</FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      step="1800"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white/30 transition-colors duration-200"
                      value={field.value ? field.value.format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={e => {
                        const date = e.target.value ? dayjs(e.target.value) : null;
                        field.onChange(date);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 顯示計算的請假時數 */}
          {calculatedHours > 0 && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-300/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">請假時數：</span>
                <span className="text-blue-200 font-semibold text-lg">{calculatedHours} 小時</span>
              </div>
            </div>
          )}
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

          {/* 附件欄位 */}
          {currentLeaveType?.required_attachment && (
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">附件上傳</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white"
                      onChange={e => {
                        if (e.target.files?.[0]) {
                          field.onChange(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
