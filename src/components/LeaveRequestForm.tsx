
import React, { useState, useEffect } from 'react';
import { format, differenceInHours } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LeaveRequest } from '@/types';

const leaveFormSchema = z.object({
  start_date: z.date({
    required_error: "請選擇請假開始日期",
  }),
  end_date: z.date({
    required_error: "請選擇請假結束日期",
  }).refine(date => date, {
    message: "請選擇請假結束日期",
  }),
  leave_type: z.enum(['annual', 'sick', 'personal', 'other'], {
    required_error: "請選擇請假類型",
  }),
  reason: z.string().min(1, {
    message: "請輸入請假事由",
  }),
}).refine((data) => data.end_date >= data.start_date, {
  message: "結束日期不能早於開始日期",
  path: ["end_date"],
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

export function LeaveRequestForm() {
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  // Calculate hours whenever start_date or end_date changes
  useEffect(() => {
    const start = form.watch('start_date');
    const end = form.watch('end_date');
    
    if (start && end) {
      // Calculate work hours (assuming 8 hours per workday)
      const hoursDiff = differenceInHours(end, start);
      // Simplified calculation - in a real app, this would account for
      // weekends, holidays, and working hours
      const workHours = Math.max(hoursDiff, 0);
      setCalculatedHours(workHours);
    }
  }, [form.watch('start_date'), form.watch('end_date')]);

  function onSubmit(data: LeaveFormValues) {
    // Create a leave request with calculated hours
    const leaveRequest: Partial<LeaveRequest> = {
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: format(data.end_date, 'yyyy-MM-dd'),
      leave_type: data.leave_type,
      reason: data.reason,
      hours: calculatedHours,
      status: 'pending'
    };

    // In a real app, this would send to an API
    console.log("Leave request submitted:", leaveRequest);
    
    toast({
      title: "請假申請已送出",
      description: `請假時數: ${calculatedHours} 小時`,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>開始日期</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
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
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
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
                <FormLabel>結束日期</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
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
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">計算請假時數: <span className="font-bold text-black">{calculatedHours}</span> 小時</p>
        </div>

        <FormField
          control={form.control}
          name="leave_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請假類型</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="選擇請假類型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="annual">特休假</SelectItem>
                  <SelectItem value="sick">病假</SelectItem>
                  <SelectItem value="personal">事假</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>請假事由</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="請輸入請假事由" 
                  className="resize-none" 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">提交請假申請</Button>
      </form>
    </Form>
  );
}

export default LeaveRequestForm;
