import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Clock, AlertTriangle } from 'lucide-react';
interface LeaveRequestFormFieldsProps {
  form: UseFormReturn<any>;
  calculatedHours: number;
  validationError: string | null;
  hasHireDate: boolean;
}
const leaveTypes = [{
  value: 'annual',
  label: '特別休假'
}, {
  value: 'personal',
  label: '事假（無薪）'
}, {
  value: 'sick',
  label: '病假（依勞基法）'
}, {
  value: 'marriage',
  label: '婚假'
}, {
  value: 'bereavement',
  label: '喪假'
}, {
  value: 'maternity',
  label: '產假'
}, {
  value: 'paternity',
  label: '陪產假'
}, {
  value: 'menstrual',
  label: '生理假（女性限定）'
}, {
  value: 'occupational',
  label: '公傷病假'
}, {
  value: 'parental',
  label: '育嬰留停（無薪）'
}, {
  value: 'other',
  label: '其他（無薪）'
}];
export function LeaveRequestFormFields({
  form,
  calculatedHours,
  validationError,
  hasHireDate
}: LeaveRequestFormFieldsProps) {
  const watchedLeaveType = form.watch('leave_type');
  return <>
      {/* 請假類型選擇 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
        <FormField control={form.control} name="leave_type" render={({
        field
      }) => <FormItem className="bg-sky-400">
              <FormLabel className="text-white font-medium">假別</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!hasHireDate && field.value === 'annual'}>
                <FormControl>
                  <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60">
                    <SelectValue placeholder="請選擇請假類型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {leaveTypes.map(type => <SelectItem key={type.value} value={type.value} disabled={!hasHireDate && type.value === 'annual'}>
                      {type.label}
                      {!hasHireDate && type.value === 'annual' && <span className="text-orange-500 ml-2">（需設定入職日期）</span>}
                    </SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
              
              {/* 特別休假選擇但未設定入職日期的警告 */}
              {watchedLeaveType === 'annual' && !hasHireDate && <div className="mt-2 p-3 bg-orange-500/20 border border-orange-300/30 rounded-lg">
                  <div className="flex items-center gap-2 text-orange-100">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      尚未設定入職日期，無法申請特別休假。請至人員資料設定入職日期。
                    </span>
                  </div>
                </div>}
            </FormItem>} />
      </div>

      {/* 請假日期 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="start_date" render={({
          field
        }) => <FormItem className="flex flex-col">
                <FormLabel className="text-white font-medium">開始日期</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30", !field.value && "text-white/60")}>
                        {field.value ? format(field.value, "yyyy-MM-dd") : <span>選擇開始日期</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>} />

          <FormField control={form.control} name="end_date" render={({
          field
        }) => <FormItem className="flex flex-col">
                <FormLabel className="text-white font-medium">結束日期</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className={cn("w-full pl-3 text-left font-normal bg-white/20 border-white/30 text-white hover:bg-white/30", !field.value && "text-white/60")}>
                        {field.value ? format(field.value, "yyyy-MM-dd") : <span>選擇結束日期</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>} />
        </div>
        
        {/* 計算時數顯示 */}
        {calculatedHours > 0 && <div className="mt-4 p-4 bg-white/10 rounded-2xl">
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                請假時數：{calculatedHours} 小時 ({calculatedHours / 8} 天)
              </span>
            </div>
          </div>}
      </div>

      {/* 請假原因 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假原因</h3>
        <FormField control={form.control} name="reason" render={({
        field
      }) => <FormItem>
              <FormLabel className="text-white font-medium">事由說明</FormLabel>
              <FormControl>
                <Textarea placeholder="請輸入請假事由..." className="bg-white/20 border-white/30 text-white placeholder:text-white/60 resize-none" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>} />
      </div>

      {/* 驗證錯誤顯示 */}
      {validationError && <div className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-300" />
            <div>
              <h4 className="text-red-100 font-semibold">申請驗證失敗</h4>
              <p className="text-red-200 text-sm mt-1">{validationError}</p>
            </div>
          </div>
        </div>}
    </>;
}