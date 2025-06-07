
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { visionProStyles } from '@/utils/visionProStyles';

interface LeaveDateSelectorProps {
  form: UseFormReturn<LeaveFormValues>;
  calculatedHours: number;
}

export function LeaveDateSelector({ form, calculatedHours }: LeaveDateSelectorProps) {
  const calculatedDays = calculatedHours / 8;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white font-medium drop-shadow-md">開始日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal backdrop-blur-xl bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl",
                        !field.value && "text-white/70"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy/MM/dd')
                      ) : (
                        <span>選擇開始日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 backdrop-blur-3xl bg-white/90 border-white/30 rounded-2xl shadow-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-300 drop-shadow-md" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-white font-medium drop-shadow-md">結束日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal backdrop-blur-xl bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-xl",
                        !field.value && "text-white/70"
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy/MM/dd')
                      ) : (
                        <span>選擇結束日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-70" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 backdrop-blur-3xl bg-white/90 border-white/30 rounded-2xl shadow-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-300 drop-shadow-md" />
            </FormItem>
          )}
        />
      </div>

      <div className={`${visionProStyles.glassBackground} p-4 rounded-xl border border-white/20`}>
        <p className="text-white/90 font-medium drop-shadow-md">
          計算請假時數: <span className="font-bold text-white drop-shadow-lg">{calculatedHours} 小時</span>
          {calculatedDays > 0 && (
            <span className="text-white/80"> ({calculatedDays} 天)</span>
          )}
        </p>
        {form.watch('leave_type') === 'annual' && calculatedHours > 0 && (
          <p className="text-blue-300 mt-1 font-medium drop-shadow-md">
            * 以工作日計算，每個工作天 8 小時，不含週末
          </p>
        )}
      </div>
    </div>
  );
}
