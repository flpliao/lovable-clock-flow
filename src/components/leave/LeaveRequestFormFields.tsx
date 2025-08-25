import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { UserStaffData } from '@/services/staffDataService';
import useDefaultLeaveTypeStore from '@/stores/defaultLeaveTypeStore';

interface LeaveRequestFormFieldsProps {
  form: UseFormReturn<{
    leave_type: string;
    start_date: Date;
    end_date: Date;
    reason: string;
  }>;
  calculatedHours: number;
  validationError: string | null;
  hasHireDate: boolean;
  userStaffData: UserStaffData | null;
}

export function LeaveRequestFormFields({
  form,
  calculatedHours,
  validationError,
  hasHireDate,
  userStaffData,
}: LeaveRequestFormFieldsProps) {
  const { defaultLeaveTypes, isLoading, isLoaded, fetchDefaultLeaveTypes } =
    useDefaultLeaveTypeStore();

  const watchedLeaveType = form.watch('leave_type');

  // 載入預設假別類型資料
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      fetchDefaultLeaveTypes().catch(console.error);
    }
  }, [isLoaded, isLoading, fetchDefaultLeaveTypes]);

  // 將 API 資料轉換為 UI 需要的格式
  const leaveTypes = defaultLeaveTypes.map(type => ({
    value: type.code.toLowerCase(),
    label: type.name,
  }));

  return (
    <>
      {/* 員工資料狀態顯示 */}
      {userStaffData && (
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">員工資料</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-white">
              <span>姓名：</span>
              <span className="font-medium">{userStaffData.name}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>部門：</span>
              <span className="font-medium">{userStaffData.department}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>職位：</span>
              <span className="font-medium">{userStaffData.position}</span>
            </div>
            <div className="flex items-center justify-between text-white">
              <span>入職日期：</span>
              <div className="flex items-center gap-2">
                {hasHireDate ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span className="font-medium">{userStaffData.hire_date}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-orange-300" />
                    <span className="text-orange-200">未設定</span>
                  </>
                )}
              </div>
            </div>
            {hasHireDate && (
              <>
                <div className="flex items-center justify-between text-white">
                  <span>年資：</span>
                  <span className="font-medium">{userStaffData.yearsOfService}</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>特休天數：</span>
                  <span className="font-medium text-green-300">
                    剩餘 {userStaffData.remainingAnnualLeaveDays} / 總計{' '}
                    {userStaffData.totalAnnualLeaveDays} 天
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
                  {leaveTypes.map(type => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      disabled={!hasHireDate && type.value === 'annual'}
                    >
                      {type.label}
                      {!hasHireDate && type.value === 'annual' && (
                        <span className="text-orange-500 ml-2">（需設定入職日期）</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />

              {/* 特別休假選擇但未設定入職日期的警告 */}
              {watchedLeaveType === 'annual' && !hasHireDate && (
                <div className="mt-2 p-3 bg-orange-500/20 border border-orange-300/30 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-100">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      尚未設定入職日期，無法申請特別休假。請至人員資料設定入職日期。
                    </span>
                  </div>
                </div>
              )}

              {/* 特別休假餘額顯示 */}
              {watchedLeaveType === 'annual' && hasHireDate && userStaffData && (
                <div className="mt-2 p-3 bg-green-500/20 border border-green-300/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-100">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      特休餘額：{userStaffData.remainingAnnualLeaveDays} 天 （總計{' '}
                      {userStaffData.totalAnnualLeaveDays} 天，已使用{' '}
                      {userStaffData.usedAnnualLeaveDays} 天）
                    </span>
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />
      </div>

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

        {/* 計算時數顯示 */}
        {calculatedHours > 0 && (
          <div className="mt-4 p-4 bg-white/10 rounded-2xl">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                請假時數：{calculatedHours} 小時 ({calculatedHours / 8} 天)
              </span>
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
      </div>

      {/* 驗證錯誤顯示 */}
      {validationError && (
        <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-300" />
            <div>
              <h4 className="text-red-100 font-semibold">申請驗證失敗</h4>
              <p className="text-red-200 text-sm mt-1">{validationError}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
