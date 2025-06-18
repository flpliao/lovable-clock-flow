
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
              <FormLabel className="text-gray-700 font-medium">開始日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white border-gray-300 hover:bg-gray-50",
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
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-gray-700 font-medium">結束日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-white border-gray-300 hover:bg-gray-50",
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
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
      </div>

      {calculatedHours > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-gray-700 font-medium">
            計算請假時數: <span className="font-bold text-blue-600">{calculatedHours} 小時</span>
            {calculatedDays > 0 && (
              <span className="text-gray-600"> ({calculatedDays} 天)</span>
            )}
          </p>
          {form.watch('leave_type') === 'annual' && calculatedHours > 0 && (
            <p className="text-blue-600 mt-1 text-sm">
              * 以工作日計算，每個工作天 8 小時，不含週末
            </p>
          )}
        </div>
      )}
    </div>
  );
}
