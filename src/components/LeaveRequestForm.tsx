
import React, { useState, useEffect } from 'react';
import { format, differenceInHours } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showApprovalDialog, setShowApprovalDialog] = useState<boolean>(false);
  const [pendingRequest, setPendingRequest] = useState<Partial<LeaveRequest> | null>(null);
  const { annualLeaveBalance, setAnnualLeaveBalance } = useUser();
  const navigate = useNavigate();
  
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
    
    // For demo purposes, we'll show the approval dialog
    if (data.leave_type === 'annual') {
      setPendingRequest(leaveRequest);
      setShowApprovalDialog(true);
    } else {
      // If not annual leave, just show confirmation and go back
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  }
  
  // This function simulates what would happen in the automation when a leave request is approved
  const handleApproveLeave = () => {
    if (pendingRequest && pendingRequest.leave_type === 'annual' && pendingRequest.hours && annualLeaveBalance) {
      const daysToDeduct = pendingRequest.hours / 8; // Convert hours to days
      
      // Update the annual leave balance
      const updatedBalance = {
        ...annualLeaveBalance,
        used_days: annualLeaveBalance.used_days + daysToDeduct
      };
      
      setAnnualLeaveBalance(updatedBalance);
      
      toast({
        title: "請假已核准",
        description: `已從特休帳戶扣除 ${daysToDeduct.toFixed(1)} 天`,
      });
      
      // Close dialog and navigate back
      setShowApprovalDialog(false);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <>
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
            {form.watch('leave_type') === 'annual' && (
              <p className="text-sm text-gray-500 mt-1">
                換算請假天數: <span className="font-bold text-black">{(calculatedHours / 8).toFixed(1)}</span> 天
              </p>
            )}
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
      
      {/* Approval Dialog (Simulating the automation) */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>模擬請假審核流程</DialogTitle>
            <DialogDescription>
              此處模擬「自動邏輯 3：請假被核准 → 自動扣除特休天數」
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <p><span className="font-medium">請假類型:</span> 特休假</p>
              <p><span className="font-medium">請假時數:</span> {calculatedHours} 小時</p>
              <p><span className="font-medium">請假天數:</span> {(calculatedHours / 8).toFixed(1)} 天</p>
              <p className="pt-2 text-sm text-amber-600">
                當請假審核為「核准」且是特休假時，系統將自動扣除特休帳戶餘額
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>取消</Button>
            <Button onClick={handleApproveLeave}>核准請假</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LeaveRequestForm;
