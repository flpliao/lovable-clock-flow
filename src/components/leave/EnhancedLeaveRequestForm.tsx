
import React, { useMemo } from 'react';
import { Form } from '@/components/ui/form';
import { LeaveDateSelector } from '@/components/leave/LeaveDateSelector';
import { LeaveTypeSelector } from '@/components/leave/LeaveTypeSelector';
import { LeaveFormDetails } from '@/components/leave/LeaveFormDetails';
import { LeaveApprovalWorkflow } from '@/components/leave/LeaveApprovalWorkflow';
import { EmployeeInfoSection } from '@/components/leave/EmployeeInfoSection';
import { ValidationResultsSection } from '@/components/leave/ValidationResultsSection';
import { FormSubmitSection } from '@/components/leave/FormSubmitSection';
import { AnnualLeaveBalanceCard } from '@/components/leave/AnnualLeaveBalanceCard';
import { useLeaveRequestFormLogic } from '@/hooks/useLeaveRequestFormLogic';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';

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

  const { loadAnnualLeaveBalance, initializeAnnualLeaveBalance } = useSupabaseLeaveManagement();
  const [balanceData, setBalanceData] = React.useState<any>(null);
  const [balanceLoading, setBalanceLoading] = React.useState(true);
  const [balanceLoadAttempted, setBalanceLoadAttempted] = React.useState(false);

  // Memoize the user ID to prevent unnecessary effect triggers
  const currentUserId = useMemo(() => currentUser?.id, [currentUser?.id]);

  // Optimized balance loading with proper dependency management
  React.useEffect(() => {
    if (!currentUserId || balanceLoadAttempted) return;
    
    const loadBalance = async () => {
      setBalanceLoading(true);
      setBalanceLoadAttempted(true);
      
      try {
        console.log(`Loading annual leave balance for user: ${currentUserId}`);
        
        // Try to load existing balance
        let balanceData = await loadAnnualLeaveBalance(currentUserId);
        
        // If no balance record exists, initialize it
        if (!balanceData) {
          await initializeAnnualLeaveBalance(currentUserId);
          balanceData = await loadAnnualLeaveBalance(currentUserId);
        }
        
        setBalanceData(balanceData);
      } catch (error) {
        console.error('載入年假餘額失敗:', error);
      } finally {
        setBalanceLoading(false);
      }
    };
    
    loadBalance();
  }, [currentUserId, loadAnnualLeaveBalance, initializeAnnualLeaveBalance, balanceLoadAttempted]);

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

      {/* Annual Leave Balance Card */}
      <AnnualLeaveBalanceCard 
        currentUser={currentUser}
        balanceData={balanceData}
        loading={balanceLoading}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Employee Information Section */}
          <EmployeeInfoSection currentUser={currentUser} />
          
          {/* Date Selection Section */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假日期</h3>
            <LeaveDateSelector 
              form={form} 
              calculatedHours={calculatedHours} 
            />
          </div>
          
          {/* Leave Type Selection */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假類型</h3>
            <LeaveTypeSelector 
              form={form}
              selectedLeaveType={watchedValues.leave_type}
            />
          </div>
          
          {/* Leave Details */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">請假詳情</h3>
            <LeaveFormDetails 
              form={form}
              selectedLeaveType={watchedValues.leave_type}
            />
          </div>

          {/* Validation Results */}
          <ValidationResultsSection 
            isValidating={isValidating}
            validationResult={validationResult}
          />
          
          {/* Approval Workflow */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-4">審核流程</h3>
            <LeaveApprovalWorkflow approvers={approvers} />
          </div>

          {/* Submit Section */}
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
