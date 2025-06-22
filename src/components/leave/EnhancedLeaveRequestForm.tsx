
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
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';

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
  const [leaveTypes, setLeaveTypes] = React.useState<any[]>([]);

  // Load leave types
  React.useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        const data = await LeaveTypeService.getLeaveTypes();
        setLeaveTypes(data || []);
      } catch (error) {
        console.error('Failed to load leave types:', error);
      }
    };
    loadLeaveTypes();
  }, []);

  // Get the actual LeaveType object
  const selectedLeaveTypeObject = leaveTypes.find(type => type.code === watchedValues.leave_type);

  // 優化餘額載入邏輯
  const currentUserId = useMemo(() => currentUser?.id, [currentUser?.id]);

  React.useEffect(() => {
    if (!currentUserId || balanceLoadAttempted) return;
    
    const loadBalance = async () => {
      setBalanceLoading(true);
      setBalanceLoadAttempted(true);
      
      try {
        console.log(`Loading annual leave balance for user: ${currentUserId}`);
        
        // 嘗試載入現有餘額
        let balanceData = await loadAnnualLeaveBalance(currentUserId);
        
        // 如果沒有餘額記錄，先初始化
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

      {/* 特別休假餘額卡片 */}
      <AnnualLeaveBalanceCard 
        currentUser={currentUser}
        balanceData={balanceData}
        loading={balanceLoading}
      />

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
              selectedLeaveType={selectedLeaveTypeObject}
            />
          </div>

          {/* 驗證結果 */}
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
