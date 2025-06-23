
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { formatDisplayDate } from '@/utils/dateUtils';

interface LeaveDateSelectorProps {
  form: UseFormReturn<LeaveFormValues>;
  calculatedHours: number;
}

export function LeaveDateSelector({ form, calculatedHours }: LeaveDateSelectorProps) {
  const calculatedDays = calculatedHours / 8;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white font-medium drop-shadow-sm">開始日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm hover:bg-white/30",
                        !field.value && "text-white/60"
                      )}
                    >
                      {field.value ? (
                        formatDisplayDate(field.value)
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
              <FormMessage className="text-red-200" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white font-medium drop-shadow-sm">結束日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm hover:bg-white/30",
                        !field.value && "text-white/60"
                      )}
                    >
                      {field.value ? (
                        formatDisplayDate(field.value)
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
              <FormMessage className="text-red-200" />
            </FormItem>
          )}
        />
      </div>

      {calculatedHours > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-white font-medium drop-shadow-sm">
            計算請假時數: <span className="font-bold text-white">{calculatedHours} 小時</span>
            {calculatedDays > 0 && (
              <span className="text-white/80"> ({calculatedDays} 天)</span>
            )}
          </p>
          {form.watch('leave_type') === 'annual' && calculatedHours > 0 && (
            <p className="text-white/80 mt-1 text-sm drop-shadow-sm">
              * 以工作日計算，每個工作天 8 小時，不含週末（時區：Asia/Taipei +08:00）
            </p>
          )}
        </div>
      )}
    </div>
  );
}
