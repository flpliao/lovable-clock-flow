
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
import { LeaveTypeDetailCard } from '@/components/leave/LeaveTypeDetailCard';
import { LeaveBalanceCard } from '@/components/leave/LeaveBalanceCard';
import { getApprovers } from '@/services/leaveRequestService';
import { Send } from 'lucide-react';
import { useLeaveFormValidation } from '@/hooks/useLeaveFormValidation';
import { ValidationResultsSection } from '@/components/leave/ValidationResultsSection';
import { formatDateForDatabase, ensureLocalDate, datePickerToDatabase } from '@/utils/dateUtils';

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
  
  const calculatedDays = calculatedHours / 8;
  
  const validationResult = useLeaveFormValidation({
    leave_type: selectedLeaveType || '',
    start_date: form.watch('start_date'),
    end_date: form.watch('end_date'),
    hours: calculatedHours
  });

  console.log('🔍 表單驗證結果:', {
    isValid: validationResult.isValid,
    hasHireDate: validationResult.hasHireDate,
    userStaffData: validationResult.userStaffData,
    errors: validationResult.errors,
    warnings: validationResult.warnings
  });

  async function handleSubmit(data: LeaveFormValues) {
    if (!currentUser) return;

    if (!validationResult.isValid) {
      console.log('❌ 表單驗證失敗，無法提交');
      return;
    }

    const localStartDate = datePickerToDatabase(data.start_date);
    const localEndDate = datePickerToDatabase(data.end_date);

    console.log('請假申請提交 - 台灣時區 (UTC+8) 日期處理日誌:', {
      form_start_date: data.start_date,
      form_end_date: data.end_date,
      converted_start_date: localStartDate,
      converted_end_date: localEndDate,
      user_staff_data: validationResult.userStaffData
    });

    const leaveRequest = {
      id: '',
      user_id: currentUser.id,
      start_date: localStartDate,
      end_date: localEndDate,
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

    console.log('即將提交的請假申請（含員工資料驗證）:', leaveRequest);

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
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white drop-shadow-md mb-2">
          請假申請
        </h2>
        <p className="text-white/80 font-medium drop-shadow-sm">
          請填寫以下資訊提交您的請假申請
        </p>
      </div>

      {/* 員工資料和特休餘額顯示 */}
      <LeaveBalanceCard 
        userStaffData={validationResult.userStaffData}
        hasHireDate={validationResult.hasHireDate}
        isLoading={false}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          
          {/* 日期選擇區塊 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期</h3>
            <LeaveDateSelector 
              form={form} 
              calculatedHours={calculatedHours} 
            />
          </div>
          
          {/* 請假類型選擇 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
            <LeaveTypeSelector 
              form={form}
              selectedLeaveType={selectedLeaveType}
              calculatedDays={calculatedDays}
              hasHireDate={validationResult.hasHireDate}
              userStaffData={validationResult.userStaffData}
            />
          </div>

          {/* 請假類型詳細資訊 */}
          {selectedLeaveType && (
            <LeaveTypeDetailCard 
              leaveType={selectedLeaveType}
              remainingDays={validationResult.userStaffData?.remainingAnnualLeaveDays}
              usedDays={validationResult.userStaffData?.usedAnnualLeaveDays || 0}
            />
          )}

          {/* 驗證結果顯示 */}
          <ValidationResultsSection validationResult={validationResult} />
          
          {/* 請假詳情 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假詳情</h3>
            <LeaveFormDetails 
              form={form}
              selectedLeaveType={selectedLeaveType}
            />
          </div>
          
          {/* 審核流程 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">審核流程</h3>
            <LeaveApprovalWorkflow approvers={approvers} />
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              disabled={!validationResult.isValid}
              className="w-full sm:w-auto px-8 py-3 backdrop-blur-xl bg-white/30 border border-white/40 text-white font-semibold shadow-lg hover:bg-white/50 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              提交請假申請
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default LeaveRequestForm;
