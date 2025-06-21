
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { LeaveRequestFormData } from '@/hooks/useLeaveRequestForm';

// 請假類型定義
const LEAVE_TYPES = [
  { id: 'annual', name: '特別休假', requiresAttachment: false, isPaid: true },
  { id: 'personal', name: '事假（無薪）', requiresAttachment: false, isPaid: false },
  { id: 'sick', name: '病假（依勞基法）', requiresAttachment: true, isPaid: true },
  { id: 'marriage', name: '婚假', requiresAttachment: true, isPaid: true },
  { id: 'bereavement', name: '喪假', requiresAttachment: true, isPaid: true },
  { id: 'maternity', name: '產假', requiresAttachment: true, isPaid: true },
  { id: 'paternity', name: '陪產假', requiresAttachment: false, isPaid: true },
  { id: 'menstrual', name: '生理假（女性限定）', requiresAttachment: false, isPaid: true },
  { id: 'occupational', name: '公傷病假', requiresAttachment: true, isPaid: true },
  { id: 'parental', name: '育嬰留停（無薪）', requiresAttachment: true, isPaid: false },
  { id: 'other', name: '其他（無薪）', requiresAttachment: false, isPaid: false },
];

interface LeaveRequestFormFieldsProps {
  form: UseFormReturn<LeaveRequestFormData>;
  calculatedHours: number;
  validationError: string | null;
}

export function LeaveRequestFormFields({ form, calculatedHours, validationError }: LeaveRequestFormFieldsProps) {
  const watchedLeaveType = form.watch('leave_type');
  const selectedLeaveType = LEAVE_TYPES.find(type => type.id === watchedLeaveType);
  const calculatedDays = calculatedHours / 8;

  return (
    <div className="space-y-6">
      {/* 請假類型選擇 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
        <FormField
          control={form.control}
          name="leave_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-medium">請假類型</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white/90 border-white/50 hover:bg-white">
                    <SelectValue placeholder="選擇請假類型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border shadow-lg rounded-lg">
                  {LEAVE_TYPES.map((type) => (
                    <SelectItem 
                      key={type.id} 
                      value={type.id}
                      className="hover:bg-gray-50 focus:bg-gray-50"
                    >
                      {type.name}
                      {!type.isPaid && <span className="text-gray-500 text-xs ml-1">(無薪)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLeaveType && (
                <FormDescription className="text-white/80">
                  {selectedLeaveType.requiresAttachment && (
                    <span>此假別需檢附相關證明文件</span>
                  )}
                  {selectedLeaveType.id === 'menstrual' && (
                    <span>每月最多1日，併入病假天數計算（年度上限30日）</span>
                  )}
                </FormDescription>
              )}
              <FormMessage className="text-red-300" />
            </FormItem>
          )}
        />
      </div>

      {/* 日期選擇區塊 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white/90 border-white/50 hover:bg-white",
                          !field.value && "text-gray-500"
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
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg rounded-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-300" />
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
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white/90 border-white/50 hover:bg-white",
                          !field.value && "text-gray-500"
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
                  <PopoverContent className="w-auto p-0 bg-white border shadow-lg rounded-lg" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
        </div>

        {/* 請假時數顯示 */}
        {calculatedHours > 0 && (
          <div className="bg-blue-50/90 border border-blue-200/50 p-4 rounded-lg">
            <p className="text-gray-700 font-medium">
              計算請假時數: <span className="font-bold text-blue-600">{calculatedHours} 小時</span>
              {calculatedDays > 0 && (
                <span className="text-gray-600"> ({calculatedDays} 天)</span>
              )}
            </p>
            <p className="text-blue-600 mt-1 text-sm">
              * 以工作日計算，每個工作天 8 小時，不含週末
            </p>
          </div>
        )}

        {/* 特休驗證錯誤 */}
        {validationError && (
          <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-2 text-red-100">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-sm font-medium">{validationError}</span>
            </div>
          </div>
        )}
      </div>

      {/* 請假詳情 */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假詳情</h3>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white font-medium">請假事由</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="請輸入請假事由" 
                    className="resize-none bg-white/90 border-white/50 hover:bg-white focus:bg-white" 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />

          {/* 附件上傳 */}
          {selectedLeaveType?.requiresAttachment && (
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">附件上傳</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      className="bg-white/90 border-white/50 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded-md hover:bg-white" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          field.onChange(e.target.files[0]);
                        }
                      }} 
                    />
                  </FormControl>
                  <FormDescription className="text-white/80">
                    請上傳相關證明文件 (如: 醫師診斷證明、證書等)
                  </FormDescription>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
