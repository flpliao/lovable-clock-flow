
import React from 'react';
import { Form } from '@/components/ui/form';
import { LeaveDateSelector } from '@/components/leave/LeaveDateSelector';
import { LeaveTypeSelector } from '@/components/leave/LeaveTypeSelector';
import { LeaveFormDetails } from '@/components/leave/LeaveFormDetails';
import { LeaveApprovalWorkflow } from '@/components/leave/LeaveApprovalWorkflow';
import { EmployeeInfoSection } from '@/components/leave/EmployeeInfoSection';
import { ValidationResultsSection } from '@/components/leave/ValidationResultsSection';
import { FormSubmitSection } from '@/components/leave/FormSubmitSection';
import { useLeaveRequestFormLogic } from '@/hooks/useLeaveRequestFormLogic';

interface EnhancedLeaveRequestFormProps {
  onSubmit?: () => void;
}

export function EnhancedLeaveRequestForm({ onSubmit }: EnhancedLeaveRequestFormProps) {
  const {
    form,
    currentUser,
    approvers,
    calculatedHours,
    watchedValues,
    validationResult,
    isValidating,
    isSubmitting,
    canSubmit,
    handleSubmit
  } = useLeaveRequestFormLogic(onSubmit);

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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 員工資訊區塊 */}
          <EmployeeInfoSection currentUser={currentUser} />
          
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
              selectedLeaveType={watchedValues.leave_type}
            />
          </div>
          
          {/* 請假詳情 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假詳情</h3>
            <LeaveFormDetails 
              form={form}
              selectedLeaveType={watchedValues.leave_type}
            />
          </div>

          {/* 驗證結果顯示 */}
          <ValidationResultsSection 
            isValidating={isValidating}
            validationResult={validationResult}
          />
          
          {/* 審核流程 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">審核流程</h3>
            <LeaveApprovalWorkflow approvers={approvers} />
          </div>

          {/* 提交按鈕 */}
          <FormSubmitSection 
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
}

export default EnhancedLeaveRequestForm;
