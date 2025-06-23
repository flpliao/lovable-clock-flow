
import React from 'react';
import { Send } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { StaffInfoCard } from './StaffInfoCard';
import { AnnualLeaveInfoCard } from './AnnualLeaveInfoCard';
import { LeaveRequestFormFields } from './LeaveRequestFormFields';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';
import { useLeaveRequestForm } from '@/hooks/useLeaveRequestForm';

interface NewLeaveRequestFormProps {
  onSubmit?: () => void;
}

export function NewLeaveRequestForm({ onSubmit }: NewLeaveRequestFormProps) {
  const {
    form,
    currentUser,
    userStaffData,
    isLoadingUserData,
    userDataError,
    calculatedHours,
    isSubmitting,
    validationError,
    handleSubmit
  } = useLeaveRequestForm();

  const selectedLeaveType = form.watch('leave_type');

  // 模擬剩餘病假天數 (實際應該從後端獲取)
  const getRemainingDays = (leaveType: string) => {
    if (leaveType === 'sick') {
      return 27; // 假設還剩27天病假
    }
    return undefined;
  };

  const onFormSubmit = async (data: any) => {
    await handleSubmit(data);
    if (onSubmit) {
      onSubmit();
    }
  };

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

      {/* 人員資訊卡片 */}
      <StaffInfoCard 
        staffData={userStaffData}
        isLoading={isLoadingUserData}
        error={userDataError}
      />

      {/* 特別休假資訊卡片 */}
      <AnnualLeaveInfoCard 
        staffData={userStaffData}
        isLoading={isLoadingUserData}
        error={userDataError}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          <LeaveRequestFormFields
            form={form}
            calculatedHours={calculatedHours}
            validationError={validationError}
            hasHireDate={userStaffData?.hire_date !== null}
          />

          {/* 請假類型詳細資訊 - 移到請假類型選擇下面 */}
          {selectedLeaveType && (
            <LeaveTypeDetailCard 
              leaveType={selectedLeaveType}
              remainingDays={getRemainingDays(selectedLeaveType)}
            />
          )}

          {/* 提交按鈕 */}
          <div className="flex justify-center pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting || !!validationError || !!userDataError}
              className="w-full sm:w-auto px-8 py-3 backdrop-blur-xl bg-white/30 border border-white/40 text-white font-semibold shadow-lg hover:bg-white/50 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? '提交中...' : '提交請假申請'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
