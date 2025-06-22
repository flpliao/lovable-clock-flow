
import React from 'react';
import { Send } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LeaveRequestFormFields } from './LeaveRequestFormFields';
import { useLeaveRequestForm } from '@/hooks/useLeaveRequestForm';

interface SimpleLeaveRequestFormProps {
  onSubmit?: () => void;
}

export function SimpleLeaveRequestForm({ onSubmit }: SimpleLeaveRequestFormProps) {
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

  const onFormSubmit = async (data: any) => {
    await handleSubmit(data);
    if (onSubmit) {
      onSubmit();
    }
  };

  if (isLoadingUserData) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">載入申請表單中...</p>
        </div>
      </div>
    );
  }

  if (userDataError) {
    return (
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
        <div className="text-center py-8">
          <div className="text-red-300 mb-4">⚠️ 載入失敗</div>
          <p className="text-white/80">{userDataError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white drop-shadow-md mb-2">
          請假申請
        </h2>
        <p className="text-white/80 font-medium drop-shadow-sm">
          請填寫以下資訊提交您的請假申請
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
          <LeaveRequestFormFields
            form={form}
            calculatedHours={calculatedHours}
            validationError={validationError}
            hasHireDate={userStaffData?.hire_date !== null}
          />

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
