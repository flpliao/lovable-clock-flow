
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { leaveFormSchema, LeaveFormValues } from '@/utils/leaveTypes';
import { useLeaveFormCalculations } from '@/hooks/useLeaveFormCalculations';
import { LeaveDateSelector } from '@/components/leave/LeaveDateSelector';
import { LeaveTypeSelector } from '@/components/leave/LeaveTypeSelector';
import { LeaveFormDetails } from '@/components/leave/LeaveFormDetails';
import { LeaveApprovalWorkflow } from '@/components/leave/LeaveApprovalWorkflow';
import { getApprovers } from '@/services/leaveRequestService';

interface LeaveRequestFormProps {
  onSubmit?: () => void;
}

export function LeaveRequestForm({ onSubmit }: LeaveRequestFormProps) {
  const { currentUser } = useUser();
  const { createLeaveRequest } = useLeaveManagementContext();
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
    const leaveRequest = {
      id: Date.now().toString(),
      user_id: currentUser?.id || '1',
      start_date: data.start_date.toISOString().split('T')[0],
      end_date: data.end_date.toISOString().split('T')[0],
      leave_type: data.leave_type as any,
      status: 'pending' as const,
      hours: calculatedHours,
      reason: data.reason,
      approval_level: 1,
      current_approver: approvers[0]?.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approvals: approvers.map((approver, index) => ({
        id: `${Date.now()}-${index}`,
        leave_request_id: Date.now().toString(),
        approver_id: approver.id,
        approver_name: approver.name,
        status: 'pending' as const,
        level: approver.level
      }))
    };

    createLeaveRequest(leaveRequest);
    
    // If there's an onSubmit handler, call it
    if (onSubmit) {
      onSubmit();
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
