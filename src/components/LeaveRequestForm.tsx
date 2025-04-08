
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LeaveRequest } from '@/types';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { useLeaveFormCalculations } from '@/hooks/useLeaveFormCalculations';
import { LeaveDateSelector } from '@/components/leave/LeaveDateSelector';
import { LeaveTypeSelector } from '@/components/leave/LeaveTypeSelector';
import { LeaveFormDetails } from '@/components/leave/LeaveFormDetails';
import { LeaveApprovalWorkflow } from '@/components/leave/LeaveApprovalWorkflow';
import { createLeaveRequest, getApprovers } from '@/services/leaveRequestService';

interface LeaveRequestFormProps {
  onSubmit?: (leaveRequest: LeaveRequest) => void;
}

export function LeaveRequestForm({ onSubmit }: LeaveRequestFormProps) {
  const { currentUser } = useUser();
  const approvers = getApprovers();
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const { calculatedHours, selectedLeaveType } = useLeaveFormCalculations(form.watch);

  function handleSubmit(data: LeaveFormValues) {
    // Create the leave request
    const leaveRequest = createLeaveRequest(
      data, 
      currentUser?.id || '1',
      calculatedHours
    );

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
        <LeaveDateSelector 
          form={form} 
          calculatedHours={calculatedHours} 
        />
        
        <LeaveTypeSelector 
          form={form}
          selectedLeaveType={selectedLeaveType}
        />
        
        <LeaveFormDetails 
          form={form}
          selectedLeaveType={selectedLeaveType}
        />
        
        <LeaveApprovalWorkflow approvers={approvers} />

        <Button type="submit" className="w-full">提交請假申請</Button>
      </form>
    </Form>
  );
}

export default LeaveRequestForm;
