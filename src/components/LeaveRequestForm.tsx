
import React, { useState, useEffect } from 'react';
import { format, differenceInHours } from 'date-fns';
import { CalendarIcon, Upload } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
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
import { LeaveRequest, ApprovalRecord } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  LEAVE_TYPES, 
  leaveFormSchema, 
  LeaveFormValues,
  getLeaveTypeById
} from '@/utils/leaveTypes';

// Mock approvers data
const approversData = [
  { id: '2', name: '王小明', position: '組長', level: 1 },
  { id: '3', name: '李經理', position: '經理', level: 2 },
  { id: '4', name: '人事部 張小姐', position: '人事專員', level: 3 }
];

interface LeaveRequestFormProps {
  onSubmit?: (leaveRequest: LeaveRequest) => void;
}

export function LeaveRequestForm({ onSubmit }: LeaveRequestFormProps) {
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [showApprovalDialog, setShowApprovalDialog] = useState<boolean>(false);
  const [pendingRequest, setPendingRequest] = useState<Partial<LeaveRequest> | null>(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
  const { annualLeaveBalance, setAnnualLeaveBalance, currentUser } = useUser();
  
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

  // Update selected leave type when the form value changes
  useEffect(() => {
    const leaveType = form.watch('leave_type');
    if (leaveType) {
      setSelectedLeaveType(leaveType);
    }
  }, [form.watch('leave_type')]);

  // Get current selected leave type details
  const currentLeaveType = selectedLeaveType ? getLeaveTypeById(selectedLeaveType) : null;

  function handleSubmit(data: LeaveFormValues) {
    // Create approval records for the leave request
    const approvals: ApprovalRecord[] = approversData.map(approver => ({
      id: `approval-${Math.random().toString(36).substr(2, 9)}`,
      leave_request_id: `leave-${Math.random().toString(36).substr(2, 9)}`,
      approver_id: approver.id,
      approver_name: approver.name,
      status: 'pending',
      level: approver.level
    }));
    
    // Create a leave request with calculated hours and approval workflow
    const leaveRequest: LeaveRequest = {
      id: `leave-${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUser?.id || '1',
      start_date: format(data.start_date, 'yyyy-MM-dd'),
      end_date: format(data.end_date, 'yyyy-MM-dd'),
      leave_type: data.leave_type as 'annual' | 'sick' | 'personal' | 'other',
      status: 'pending',
      hours: calculatedHours,
      reason: data.reason,
      approvals: approvals,
      approval_level: 1, // Start at the first approval level
      current_approver: approversData[0].id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // In a real app, this would send to an API
    console.log("Leave request submitted:", leaveRequest);
    
    toast({
      title: "請假申請已送出",
      description: `請假時數: ${calculatedHours} 小時，等待主管審核`,
    });
    
    // If there's an onSubmit handler, call it
    if (onSubmit) {
      onSubmit(leaveRequest);
    }
    
    // Reset the form
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  {LEAVE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}{' '}
                      {!type.isPaid && <span className="text-gray-400 text-xs">(無薪)</span>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentLeaveType && (
                <FormDescription>
                  {currentLeaveType.description}
                  {currentLeaveType.maxDaysPerYear && (
                    <span> (每年上限 {currentLeaveType.maxDaysPerYear} 天)</span>
                  )}
                </FormDescription>
              )}
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

        {/* Attachment field for leave types that require it */}
        {currentLeaveType?.requiresAttachment && (
          <FormField
            control={form.control}
            name="attachment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>附件上傳</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="file" 
                      className="flex-1" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          field.onChange(e.target.files[0]);
                        }
                      }} 
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  請上傳相關證明文件 (如: 醫師診斷證明、證書等)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {/* Approvers information */}
        <div className="space-y-2 rounded-lg border p-4">
          <h3 className="text-sm font-medium">審核流程</h3>
          <div className="space-y-2">
            {approversData.map((approver, index) => (
              <div key={approver.id} className="flex items-center">
                <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div className="ml-2">
                  <span className="text-sm font-medium">{approver.name}</span>
                  <span className="text-xs text-gray-500 ml-1">({approver.position})</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            請假審核將按照以上流程進行，所有審核人同意後才會核准。
          </p>
        </div>

        <Button type="submit" className="w-full">提交請假申請</Button>
      </form>
    </Form>
  );
}

export default LeaveRequestForm;
