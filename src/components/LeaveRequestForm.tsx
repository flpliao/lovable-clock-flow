
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
import { Send } from 'lucide-react';

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

  async function handleSubmit(data: LeaveFormValues) {
    if (!currentUser) return;

    const leaveRequest = {
      id: '',
      user_id: currentUser.id,
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
        leave_request_id: '',
        approver_id: approver.id,
        approver_name: approver.name,
        status: 'pending' as const,
        level: approver.level
      }))
    };

    const success = await createLeaveRequest(leaveRequest);
    
    if (success) {
      if (onSubmit) {
        onSubmit();
      }
      form.reset();
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 日期選擇 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">請假日期</h3>
            <LeaveDateSelector 
              form={form} 
              calculatedHours={calculatedHours} 
            />
          </div>
          
          {/* 請假類型 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">請假類型</h3>
            <LeaveTypeSelector 
              form={form}
              selectedLeaveType={selectedLeaveType}
            />
          </div>
          
          {/* 請假詳情 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">請假詳情</h3>
            <LeaveFormDetails 
              form={form}
              selectedLeaveType={selectedLeaveType}
            />
          </div>
          
          {/* 審核流程 */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">審核流程</h3>
            <LeaveApprovalWorkflow approvers={approvers} />
          </div>

          {/* 提交按鈕 */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              提交請假申請
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default LeaveRequestForm;
